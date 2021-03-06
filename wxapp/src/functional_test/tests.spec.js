const automator = require("miniprogram-automator");
const expect_or = require("./helpers/expect_or.js");
const check_if_result_page_is_empty = require("./helpers/check_if_result_page_is_empty.js")

let miniprogram;
const remote = false;

jest.setTimeout(60000);

beforeAll(async () => {
    miniprogram = await automator.launch({
      projectPath: "../wxapp"
    });
    if(remote == true) {
        await miniprogram.remote();
    }
});

afterAll(async () => {
    await miniprogram.close();
});


/* 
  Story: #10 搜索页面
*/ 
describe("search page", () => {

    let search_page;

    beforeAll(async () => {
        const page = await miniprogram.reLaunch("/pages/index/index");
        await (await page.$("input.van-field__input")).tap();
        await page.waitFor(1000);
        search_page = await miniprogram.currentPage();
    });
    

    it("Hot search entries should contain Buddy Program", async () => {
        const hot_search_tags_div_elem = await search_page.$("div.search-tag");
        const elem_wxml = await hot_search_tags_div_elem.outerWxml();
        expect_or(
            () => expect(elem_wxml).toContain("Buddy Program"),
            () => expect(elem_wxml).toContain("暂无")
        );
    });

    it("Search history should contain Buddy Program", async () => {
        const hot_search_tags_div_elem = (await search_page.$$("div.search-tag"))[1];
        const elem_wxml = await hot_search_tags_div_elem.outerWxml();
        expect_or(
            () => expect(elem_wxml).toContain("Buddy Program"),
            () => expect(elem_wxml).toContain("暂无")
        );
    });
});


/*
  Story: #11 搜索页面结果
*/
describe("search result page", () => {

    let search_page;

    beforeAll(async () => {
        const page = await miniprogram.reLaunch("/pages/index/index");
        await (await page.$("input.van-field__input")).tap();
        await page.waitFor(1000);
        search_page = await miniprogram.currentPage();
    }, 30000);
    

    it("Should see search result page when searching a keyword", async () => {
        const search_input = await search_page.$("input.search-box");
        const keyword = "test";
        await search_input.input(keyword);
        const search_result_page = await miniprogram.navigateTo("/pages/search-result/search-result?key=" + keyword);
        try {
            const search_result_wxml = await(await search_result_page.$("van-tabs")).outerWxml();
            expect_or(
                () => expect(search_result_wxml).toContain("新闻"),
                () => expect(search_result_wxml).toContain("政策")
            );
        }
        catch(e) {
            expect(await check_if_result_page_is_empty(search_result_page)).toBe(true);
        }
    });
});


// /*
//   [1] Story: #12 文章详情页面
// */
// describe("Article details page in webview", () => {

//     let page;

//     beforeAll(async () => {
//         page = await miniprogram.reLaunch("/pages/search-result/search-result?key=Insurance");
//         await page.waitFor(500);
//         while (await check_if_result_page_is_empty(page) == true) {
//             page = await miniprogram.reLaunch("/pages/search-result/search-result?key=Insurance");
//             await page.waitFor(500);
//         }
//     }, 30000);

//     it("Detail page will be opened in a webview page", async () => {
//         const first_item = (await page.$$("view.list--item-list view.list--item"))[0];
//         await first_item.tap();
//         await page.waitFor(1000);
//         const webview_page = await miniprogram.currentPage();
//         const webview_elem = await webview_page.$("web-view");
//         expect(webview_elem).toBeTruthy();
//     });
// });

/*
  [2] Story: #12 文章详情页面
*/
describe("Article details page in towxml", () => {

    let page;
    let detail_page;

    beforeAll(async () => {
        page = await miniprogram.reLaunch("/pages/policy/policy");
        await page.waitFor(500);
        const first_grid = (await page.$$("view.van-grid-item__content"))[0];
        await first_grid.tap();
        await page.waitFor(1000);
        detail_page = await miniprogram.currentPage();
    }, 30000);

    it("Detail page will be opened in a towxml component", async () => {
        const towxml_elem = await detail_page.$("towxml");
        expect(towxml_elem).toBeTruthy();
    });

    it("Detail page should contain a share button", async () => {
        const towxml_elem = await detail_page.$("button.share-btn");
        expect(towxml_elem).toBeTruthy();
    })

});


/*
  Story: #15 新闻页面各模块文章list页面
*/
describe("News page", () => {

    let page;

    beforeAll(async () => {
        page = await miniprogram.reLaunch("/pages/index/index");
        await page.waitFor(500);
    }, 30000);

    it("4 Tabs should present", async () => {
        const navigator_bar = await page.$("view.van-tabs__nav.van-tabs__nav--line");
        const nav_bar_text = await navigator_bar.text();
        expect(nav_bar_text).toContain("Newsletter");
        expect(nav_bar_text).toContain("活动");
        expect(nav_bar_text).toContain("博客大赛");
        expect(nav_bar_text).toContain("Admin");
    });

    it("The first tab should contain article card", async() => {
        await expect_article_card_to_exist(page);
    });

    it("The second tab should contain article card", async() => {
        const tabs_selector = "view.van-tabs__nav.van-tabs__nav--line view.van-ellipsis.van-tab";
        const second_tab_elem = (await page.$$(tabs_selector))[1];
        await second_tab_elem.tap();
        if (remote == true) {
            await page.waitFor(5000);
        } else {
            await page.waitFor(1500);
        }
        await expect_article_card_to_exist(page);
    });

    async function expect_article_card_to_exist(page) {
        const content_container = await page.$("van-tab.article-tab");
        const content_container_wxml = await content_container.outerWxml();
        expect(content_container_wxml).toContain("<article-card ");
    }
});


/*
  Story: #48 消息list页面
*/
describe("message page", () => {

    let page;

    beforeAll(async () => {
        page = await miniprogram.reLaunch("/pages/message/message");
        await page.waitFor(500);
    }, 30000);

    it("Message page should contain message cards", async () => {
        const message_cells = await page.$$("message-card van-cell");
        expect(message_cells).toBeTruthy();
    });

    it("The unread tag should disappear when a message card is clicked", async () => {
        const first_message_tab = (await page.$("message-card van-cell:nth-child(1) view.van-cell"));
        const title_css_selectoor = "message-card van-cell:nth-child(1) view.van-cell view.card-index--title-box";
        const first_message_title = await page.$(title_css_selectoor);
        const first_message_title_wxml = await first_message_title.outerWxml();
        expect(first_message_title_wxml).toContain(">未读<");
        await first_message_tab.tap();
        await page.waitFor(1000);
        await miniprogram.navigateBack();
        const first_message_title_after_tap = await page.$(title_css_selectoor);
        const first_message_title_wxml_after_tap = await first_message_title_after_tap.outerWxml();
        expect(first_message_title_wxml_after_tap).not.toContain(">未读<");
    });
});
