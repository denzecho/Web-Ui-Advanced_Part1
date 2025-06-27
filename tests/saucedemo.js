const { Builder, By, until, Select } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

describe('SauceDemo Login & Sort Products', function () {
    this.timeout(30000); 
    let driver;

    before(async function () {
        console.log('Login awal untuk menandai dimulainya rangkaian pengujian');

    });

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize();
        await driver.get('https://www.saucedemo.com');
        console.log('membuka halaman login SauceDemo');
    });

    afterEach(async function () {
        if (driver) {
            await driver.quit();
            console.log('menutup browser setelah setiap pengujian');
        }
    });

    after(async function () {
        console.log('Melakukan login akhir atau membuat laporan hasil pengujian');
    });

    it('Harus login dengan kredensial yang valid', async function () {
        
        let inputUsername = await driver.findElement(By.css('[data-test="username"]'));
        let inputPassword = await driver.findElement(By.xpath('//*[@data-test="password"]'));
        let buttonLogin = await driver.findElement(By.className('submit-button btn_action'));

        await inputUsername.sendKeys('standard_user');
        await inputPassword.sendKeys('secret_sauce');
        await buttonLogin.click();

        let productsPageTitle = await driver.wait(
            until.elementLocated(By.className('title')),
            10000,
            
        );
        let actualTitleText = await productsPageTitle.getText();
        assert.strictEqual(actualTitleText, 'Products', 'Judul halaman tidak menampilkan "Products" setelah login.');

        let buttonCart = await driver.wait(
            until.elementLocated(By.xpath('//*[@data-test="shopping-cart-link"]')),
            10000,
            
        );
        await driver.wait(until.elementIsVisible(buttonCart), 5000, 'Keranjang belanja tidak terlihat.');
        assert(await buttonCart.isDisplayed(), 'Keranjang belanja tidak ditampilkan');
    });

    it('Sorting produk dari Z-A setelah login', async function () {

        let inputUsername = await driver.findElement(By.css('[data-test="username"]'));
        let inputPassword = await driver.findElement(By.xpath('//*[@data-test="password"]'));
        let buttonLogin = await driver.findElement(By.className('submit-button btn_action'));

        await inputUsername.sendKeys('standard_user');
        await inputPassword.sendKeys('secret_sauce');
        await buttonLogin.click();

        await driver.wait(
            until.elementLocated(By.className('product_sort_container')),
            10000,
            
        );

        let sortDropdownElement = await driver.findElement(By.className('product_sort_container'));
        let sortDropdown = new Select(sortDropdownElement); 

     
        await sortDropdown.selectByValue('za');

        await driver.sleep(1000);

        let productNames = await driver.findElements(By.className('inventory_item_name'));
        let names = [];
        for (let product of productNames) {
            names.push(await product.getText());
        }

        let sortedNamesExpected = [...names].sort((a, b) => b.localeCompare(a)); // Z-A

        assert.deepStrictEqual(names, sortedNamesExpected, 'Produk tidak diurutkan dari Z-A dengan benar.');

    });
});