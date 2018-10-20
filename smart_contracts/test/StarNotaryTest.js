const StarNotary = artifacts.require('StarNotary');

contract('StarNotary', accounts => {

    beforeEach(async function () {
        this.contract = await StarNotary.new({from: accounts[0]})
    });

    describe('can create a star', () => {
        it('can create a star and get its properties', async function () {

            await this.contract.createStar("awesome star!", "a star story", "032.155", "121.874", "245.978", {from: accounts[0]});
            let tokenIdToStarInfo = await this.contract.tokenIdToStarInfo(1);

            assert.deepEqual(tokenIdToStarInfo, ["awesome star!", "a star story", "ra_032.155", "dec_121.874", "mag_245.978"]);
        });

        it('can not create a star already registered', async function () {

            await this.contract.createStar("awesome star!", "a star story", "032.155", "121.874", "245.978", {from: accounts[0]});

            try {
                await this.contract.createStar("duplicate star!", "a not so star story", "032.155", "121.874", "245.978", {from: accounts[1]});
                assert.fail("Expected throw not received");
            } catch (e) {
                let duplicate = e.message.search("coordinates already exists");
                assert.ok(duplicate > 0, "expected coordinates already exist error but got " + e.message + "instead");
            }
        })
    });

    describe('buying and selling stars', () => {
        let user1 = accounts[1];
        let user2 = accounts[2];
        let user3 = accounts[3];
        let randomMaliciousUser = accounts[4];

        let starId = 1;
        let starPrice = web3.toWei(.01, "ether");
        let ra = "032.155";
        let dec = "121.874";
        let mag = "245.978";

        beforeEach(async function () {
            await this.contract.createStar('awesome star!', "story", ra, dec, mag, {from: user1})
        });

        it('user1 can put up their star for sale', async function () {
            assert.equal(await this.contract.ownerOf(starId), user1);
            await this.contract.putStarUpForSale(starId, starPrice, {from: user1});

            assert.equal(await this.contract.starsForSale(starId), starPrice)
        });

        it('unapproved user can not put up their star for sale', async function () {
            assert.notEqual(await this.contract.getApproved(starId), user3);

            try {
                await this.contract.putStarUpForSale(starId, starPrice, {from: user3});
                assert.fail("Expected throw not received");
            } catch (e) {
                assert.equal(await this.contract.starsForSale(starId), 0)
            }

        });

        it('user other than owner can not approve user', async function () {
            try {
                await this.contract.approve(user3, starId, {from: user3});
                assert.fail("Expected throw not received");
            } catch (e) {
                assert.equal(await this.contract.getApproved(starId), 0)
            }

        });

        describe('owner can approve user to transact on their behalf', () => {
            beforeEach(async function () {
                await this.contract.approve(user3, starId, {from: user1});
            });

            it('user3 is approved user', async function () {
                assert.equal(await this.contract.getApproved(starId), user3);
            });

            it('user3 can put star for sale', async function () {
                assert.equal(await this.contract.starsForSale(starId), 0);
                await this.contract.putStarUpForSale(starId, starPrice, {from: user3});

                assert.equal(await this.contract.starsForSale(starId), starPrice)
            });

        });

        describe('owner can approve operator to transact all token', () => {
            beforeEach(async function () {
                await this.contract.setApprovalForAll(user3, true, {from: user1});
            });

            it('user3 is approved operator', async function () {
                assert.equal(await this.contract.isApprovedForAll(user1, user3), true);
            });

            it('user3 can put star for sale', async function () {
                assert.equal(await this.contract.starsForSale(starId), 0);
                await this.contract.putStarUpForSale(starId, starPrice, {from: user3});

                assert.equal(await this.contract.starsForSale(starId), starPrice)
            });

            it('user1 can unapprove operator', async function () {
                await this.contract.setApprovalForAll(user3, false, {from: user1});

                assert.equal(await this.contract.isApprovedForAll(user1, user3), false);
            });

        });


        it('user2 can check if star already exist', async function () {
            assert.ok(await this.contract.checkIfStarExist(ra, dec, mag, {from: user2}))
        });

        it('user2 can check if star does not exist', async function () {
            let newMag = "234.342";
            assert.equal((await this.contract.checkIfStarExist(ra, dec, newMag, {from: user2})), false);
        });

        describe('user2 can buy a star that was put up for sale', () => {
            beforeEach(async function () {
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1});
            });

            it('user2 is the owner of the star after they buy it', async function () {
                await this.contract.buyStar(starId, {from: user2, value: starPrice, gasPrice: 0});
                assert.equal(await this.contract.ownerOf(starId), user2);
            });

            it('user2 ether balance changed correctly', async function () {
                let overpaidAmount = web3.toWei(.05, 'ether');
                const balanceBeforeTransaction = web3.eth.getBalance(user2);
                await this.contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice: 0});
                const balanceAfterTransaction = web3.eth.getBalance(user2);
                assert.equal(balanceBeforeTransaction.sub(balanceAfterTransaction), starPrice)
            })
        })
    });

    describe("User can claim and transfer tokens", () => {
        let starId = 1;
        let user1 = accounts[1];
        let user2 = accounts[2];

        beforeEach(async function () {
            await this.contract.mint(user1, starId);
        });

        it('user1 can mint a new token', async function () {
            assert.equal(await this.contract.ownerOf(starId), user1);
        });

        it('user1 can transfer owned token', async function () {
            await this.contract.safeTransferFrom(user1, user2, starId, {from: user1});

            assert.equal(await this.contract.ownerOf(starId), user2);
        })
    });

});