<template name="skeleton">
  <view class="sk-container">
    <view class="chatbox data-v-d8a8d0ea">
      <view class="u-navbar navbar--u-navbar data-v-9d9e7ee2 navbar--data-v-9d9e7ee2">
        <view
          class="u-navbar__placeholder navbar--u-navbar__placeholder data-v-9d9e7ee2 navbar--data-v-9d9e7ee2"
          style="height: 88px"
        ></view>
        <view
          class="data-v-9d9e7ee2 navbar--data-v-9d9e7ee2 u-navbar--fixed navbar--u-navbar--fixed"
        >
          <view
            class="u-status-bar bar--u-status-bar data-v-c0b45a48 bar--data-v-c0b45a48"
            style="height: 44px; background-color: #f5f5f5"
          ></view>
          <view
            class="u-navbar__content navbar--u-navbar__content data-v-9d9e7ee2 navbar--data-v-9d9e7ee2"
            style="height: 44px; background-color: #f5f5f5"
          >
            <view
              class="u-navbar__content__left navbar--u-navbar__content__left data-v-9d9e7ee2 navbar--data-v-9d9e7ee2"
              hover-class="u-navbar__content__left--hover"
              hover-start-time="150"
            >
              <view
                class="u-icon icon--u-icon data-v-1c933a9a icon--data-v-1c933a9a u-icon--right icon--u-icon--right"
              >
                <text
                  class="u-icon__icon icon--u-icon__icon data-v-1c933a9a icon--data-v-1c933a9a uicon-arrow-left icon--uicon-arrow-left sk-transparent sk-text-0-0000-83 sk-text"
                  style="
                    font-size: 20px;
                    line-height: 20px;
                    font-weight: normal;
                    top: 0px;
                    color: #303133;
                  "
                  ></text
                >
              </view>
            </view>
            <text
              class="u-line-1 navbar--u-line-1 u-navbar__content__title navbar--u-navbar__content__title data-v-9d9e7ee2 navbar--data-v-9d9e7ee2 sk-transparent sk-text-14-2857-24 sk-text"
              style="width: 200px; font-weight: bold; background-position-x: 50%"
              >管理申请</text
            >
          </view>
        </view>
      </view>
      <view class="chatbox__search-input data-v-d8a8d0ea">
        <view class="chatbox__search-input__content data-v-d8a8d0ea">
          <view
            class="u-search search--u-search data-v-ed789780 search--data-v-ed789780"
            style="margin: 0"
          >
            <view
              class="u-search__content search--u-search__content data-v-ed789780 search--data-v-ed789780"
              style="background-color: #f8f9fd; border-radius: 4px; border-color: transparent"
            >
              <view
                class="u-search__content__icon search--u-search__content__icon data-v-ed789780 search--data-v-ed789780"
              >
                <view
                  class="u-icon icon--u-icon data-v-1c933a9a icon--data-v-1c933a9a u-icon--right icon--u-icon--right"
                >
                  <text
                    class="u-icon__icon icon--u-icon__icon data-v-1c933a9a icon--data-v-1c933a9a uicon-search icon--uicon-search sk-transparent sk-text-0-0000-628 sk-text"
                    style="
                      font-size: 26px;
                      line-height: 26px;
                      font-weight: normal;
                      top: 0px;
                      color: #565b6d;
                    "
                    ></text
                  >
                </view>
              </view>
              <view
                class="u-search__content__input search--u-search__content__input data-v-ed789780 search--data-v-ed789780 sk-image"
                maxlength="-1"
                placeholder="请输入关键字"
                placeholder-class="u-search__content__input--placeholder"
                placeholder-style="color: #979797"
                style="text-align: left; color: #606266; background-color: #f8f9fd; height: 40px"
                type="text"
                value="true"
              ></view>
            </view>
            <text
              class="u-search__action search--u-search__action data-v-ed789780 search--data-v-ed789780 sk-transparent sk-opacity"
              style="true"
              >搜索</text
            >
          </view>
        </view>
      </view>
      <view class="chatbox__search-list-item data-v-d8a8d0ea">
        <scroll-view class="chatbox__search-list-item__content data-v-d8a8d0ea" scroll-y>
          <view class="data-v-d8a8d0ea">
            <view class="data-v-d8a8d0ea">
              <view class="data-v-4c29108f MessageItem--data-v-4c29108f">
                <view class="password-popup PasswordPopup--password-popup">
                  <view
                    class="u-popup popup--u-popup data-v-74921bef popup--data-v-74921bef"
                  ></view>
                </view>
              </view>
            </view>
          </view>
          <view class="chatbox__search-list-item__time data-v-d8a8d0ea">
            <view
              class="u-text u-text--u-text data-v-5fec1d8b u-text--data-v-5fec1d8b"
              style="margin: 0; justify-content: flex-start"
            >
              <text
                class="u-text__value u-text--u-text__value data-v-5fec1d8b u-text--data-v-5fec1d8b sk-transparent sk-text-14-2857-182 sk-text"
                style="
                  text-decoration: none;
                  font-weight: normal;
                  word-wrap: normal;
                  font-size: 15px;
                  color: #303133;
                "
                >三天前</text
              >
            </view>
          </view>
          <view class="data-v-d8a8d0ea">
            <view class="data-v-d8a8d0ea">
              <view
                class="chatbox__search-list-item__content MessageItem--chatbox__search-list-item__content data-v-4c29108f MessageItem--data-v-4c29108f"
              >
                <view
                  class="chatbox__search-list-item__content__img MessageItem--chatbox__search-list-item__content__img data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <image
                    lazy-load="true"
                    class="data-v-4c29108f MessageItem--data-v-4c29108f sk-image"
                    style="width: 63px; height: 63px; border-radius: 4px; margin: 6px"
                  ></image>
                </view>
                <view
                  class="chatbox__search-list-item__content__info-name MessageItem--chatbox__search-list-item__content__info-name data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <view
                    class="u-text u-text--u-text data-v-5fec1d8b u-text--data-v-5fec1d8b"
                    style="margin: 0; justify-content: flex-start"
                  >
                    <text
                      class="u-text__value u-text--u-text__value data-v-5fec1d8b u-text--data-v-5fec1d8b sk-transparent sk-text-14-2857-411 sk-text"
                      style="
                        text-decoration: none;
                        font-weight: normal;
                        word-wrap: normal;
                        font-size: 15px;
                        color: #303133;
                      "
                      >共同编辑</text
                    >
                  </view>
                </view>
                <view
                  class="chatbox__search-list-item__content__info-owner MessageItem--chatbox__search-list-item__content__info-owner data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <view
                    class="u-avatar avatar--u-avatar data-v-14a988f2 avatar--data-v-14a988f2 u-avatar--circle avatar--u-avatar--circle"
                    style="background-color: transparent; width: 21px; height: 21px"
                  >
                    <image
                      class="u-avatar__image avatar--u-avatar__image data-v-14a988f2 avatar--data-v-14a988f2 u-avatar__image--circle avatar--u-avatar__image--circle sk-image"
                      mode="scaleToFill"
                      style="width: 21px; height: 21px"
                    ></image>
                  </view>
                  <view
                    class="chatbox__search-list-item__content__info-owner__username MessageItem--chatbox__search-list-item__content__info-owner__username data-v-4c29108f MessageItem--data-v-4c29108f"
                  >
                    <view
                      class="u-text u-text--u-text data-v-5fec1d8b u-text--data-v-5fec1d8b"
                      style="margin: 0; justify-content: flex-start"
                    >
                      <text
                        class="u-text__value u-text--u-text__value data-v-5fec1d8b u-text--data-v-5fec1d8b sk-transparent sk-text-0-0000-371 sk-text"
                        style="
                          text-decoration: none;
                          font-weight: normal;
                          word-wrap: normal;
                          font-size: 12px;
                          color: #303133;
                          line-height: 12px;
                        "
                        >一二三四</text
                      >
                    </view>
                  </view>
                </view>
                <view
                  class="chatbox__search-list-item__content__button MessageItem--chatbox__search-list-item__content__button data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <label
                    class="data-v-4c29108f MessageItem--data-v-4c29108f sk-transparent sk-text-26-0000-45 sk-text"
                    style="background-position-x: 50%"
                    >已同意</label
                  >
                </view>
              </view>
              <view class="data-v-4c29108f MessageItem--data-v-4c29108f">
                <view class="password-popup PasswordPopup--password-popup">
                  <view
                    class="u-popup popup--u-popup data-v-74921bef popup--data-v-74921bef"
                  ></view>
                </view>
              </view>
            </view>
          </view>
          <view class="data-v-d8a8d0ea">
            <view class="data-v-d8a8d0ea">
              <view
                class="chatbox__search-list-item__content MessageItem--chatbox__search-list-item__content data-v-4c29108f MessageItem--data-v-4c29108f"
              >
                <view
                  class="chatbox__search-list-item__content__img MessageItem--chatbox__search-list-item__content__img data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <image
                    lazy-load="true"
                    class="data-v-4c29108f MessageItem--data-v-4c29108f sk-image"
                    style="width: 63px; height: 63px; border-radius: 4px; margin: 6px"
                  ></image>
                </view>
                <view
                  class="chatbox__search-list-item__content__info-name MessageItem--chatbox__search-list-item__content__info-name data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <view
                    class="u-text u-text--u-text data-v-5fec1d8b u-text--data-v-5fec1d8b"
                    style="margin: 0; justify-content: flex-start"
                  >
                    <text
                      class="u-text__value u-text--u-text__value data-v-5fec1d8b u-text--data-v-5fec1d8b sk-transparent sk-text-14-2857-73 sk-text"
                      style="
                        text-decoration: none;
                        font-weight: normal;
                        word-wrap: normal;
                        font-size: 15px;
                        color: #303133;
                      "
                      >物品3</text
                    >
                  </view>
                </view>
                <view
                  class="chatbox__search-list-item__content__info-owner MessageItem--chatbox__search-list-item__content__info-owner data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <view
                    class="u-avatar avatar--u-avatar data-v-14a988f2 avatar--data-v-14a988f2 u-avatar--circle avatar--u-avatar--circle"
                    style="background-color: transparent; width: 21px; height: 21px"
                  >
                    <image
                      class="u-avatar__image avatar--u-avatar__image data-v-14a988f2 avatar--data-v-14a988f2 u-avatar__image--circle avatar--u-avatar__image--circle sk-image"
                      mode="scaleToFill"
                      style="width: 21px; height: 21px"
                    ></image>
                  </view>
                  <view
                    class="chatbox__search-list-item__content__info-owner__username MessageItem--chatbox__search-list-item__content__info-owner__username data-v-4c29108f MessageItem--data-v-4c29108f"
                  >
                    <view
                      class="u-text u-text--u-text data-v-5fec1d8b u-text--data-v-5fec1d8b"
                      style="margin: 0; justify-content: flex-start"
                    >
                      <text
                        class="u-text__value u-text--u-text__value data-v-5fec1d8b u-text--data-v-5fec1d8b sk-transparent sk-text-0-0000-941 sk-text"
                        style="
                          text-decoration: none;
                          font-weight: normal;
                          word-wrap: normal;
                          font-size: 12px;
                          color: #303133;
                          line-height: 12px;
                        "
                        >一二三四</text
                      >
                    </view>
                  </view>
                </view>
                <view
                  class="chatbox__search-list-item__content__button MessageItem--chatbox__search-list-item__content__button data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <label
                    class="data-v-4c29108f MessageItem--data-v-4c29108f sk-transparent sk-text-26-0000-317 sk-text"
                    style="background-position-x: 50%"
                    >已失效</label
                  >
                </view>
              </view>
              <view class="data-v-4c29108f MessageItem--data-v-4c29108f">
                <view class="password-popup PasswordPopup--password-popup">
                  <view
                    class="u-popup popup--u-popup data-v-74921bef popup--data-v-74921bef"
                  ></view>
                </view>
              </view>
            </view>
          </view>
          <view class="data-v-d8a8d0ea">
            <view class="data-v-d8a8d0ea">
              <view
                class="chatbox__search-list-item__content MessageItem--chatbox__search-list-item__content data-v-4c29108f MessageItem--data-v-4c29108f"
              >
                <view
                  class="chatbox__search-list-item__content__img MessageItem--chatbox__search-list-item__content__img data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <image
                    lazy-load="true"
                    class="data-v-4c29108f MessageItem--data-v-4c29108f sk-image"
                    style="width: 63px; height: 63px; border-radius: 4px; margin: 6px"
                  ></image>
                </view>
                <view
                  class="chatbox__search-list-item__content__info-name MessageItem--chatbox__search-list-item__content__info-name data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <view
                    class="u-text u-text--u-text data-v-5fec1d8b u-text--data-v-5fec1d8b"
                    style="margin: 0; justify-content: flex-start"
                  >
                    <text
                      class="u-text__value u-text--u-text__value data-v-5fec1d8b u-text--data-v-5fec1d8b sk-transparent sk-text-14-2857-909 sk-text"
                      style="
                        text-decoration: none;
                        font-weight: normal;
                        word-wrap: normal;
                        font-size: 15px;
                        color: #303133;
                      "
                      >item2</text
                    >
                  </view>
                </view>
                <view
                  class="chatbox__search-list-item__content__info-owner MessageItem--chatbox__search-list-item__content__info-owner data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <view
                    class="u-avatar avatar--u-avatar data-v-14a988f2 avatar--data-v-14a988f2 u-avatar--circle avatar--u-avatar--circle"
                    style="background-color: transparent; width: 21px; height: 21px"
                  >
                    <image
                      class="u-avatar__image avatar--u-avatar__image data-v-14a988f2 avatar--data-v-14a988f2 u-avatar__image--circle avatar--u-avatar__image--circle sk-image"
                      mode="scaleToFill"
                      style="width: 21px; height: 21px"
                    ></image>
                  </view>
                  <view
                    class="chatbox__search-list-item__content__info-owner__username MessageItem--chatbox__search-list-item__content__info-owner__username data-v-4c29108f MessageItem--data-v-4c29108f"
                  >
                    <view
                      class="u-text u-text--u-text data-v-5fec1d8b u-text--data-v-5fec1d8b"
                      style="margin: 0; justify-content: flex-start"
                    >
                      <text
                        class="u-text__value u-text--u-text__value data-v-5fec1d8b u-text--data-v-5fec1d8b sk-transparent sk-text-0-0000-467 sk-text"
                        style="
                          text-decoration: none;
                          font-weight: normal;
                          word-wrap: normal;
                          font-size: 12px;
                          color: #303133;
                          line-height: 12px;
                        "
                        >一二三四</text
                      >
                    </view>
                  </view>
                </view>
                <view
                  class="chatbox__search-list-item__content__button MessageItem--chatbox__search-list-item__content__button data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <label
                    class="data-v-4c29108f MessageItem--data-v-4c29108f sk-transparent sk-text-26-0000-80 sk-text"
                    style="background-position-x: 50%"
                    >已同意</label
                  >
                </view>
              </view>
              <view class="data-v-4c29108f MessageItem--data-v-4c29108f">
                <view class="password-popup PasswordPopup--password-popup">
                  <view
                    class="u-popup popup--u-popup data-v-74921bef popup--data-v-74921bef"
                  ></view>
                </view>
              </view>
            </view>
          </view>
          <view class="data-v-d8a8d0ea">
            <view class="data-v-d8a8d0ea">
              <view
                class="chatbox__search-list-item__content MessageItem--chatbox__search-list-item__content data-v-4c29108f MessageItem--data-v-4c29108f"
              >
                <view
                  class="chatbox__search-list-item__content__img MessageItem--chatbox__search-list-item__content__img data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <image
                    lazy-load="true"
                    class="data-v-4c29108f MessageItem--data-v-4c29108f sk-image"
                    style="width: 63px; height: 63px; border-radius: 4px; margin: 6px"
                  ></image>
                </view>
                <view
                  class="chatbox__search-list-item__content__info-name MessageItem--chatbox__search-list-item__content__info-name data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <view
                    class="u-text u-text--u-text data-v-5fec1d8b u-text--data-v-5fec1d8b"
                    style="margin: 0; justify-content: flex-start"
                  >
                    <text
                      class="u-text__value u-text--u-text__value data-v-5fec1d8b u-text--data-v-5fec1d8b sk-transparent sk-text-14-2857-443 sk-text"
                      style="
                        text-decoration: none;
                        font-weight: normal;
                        word-wrap: normal;
                        font-size: 15px;
                        color: #303133;
                      "
                      >物品1</text
                    >
                  </view>
                </view>
                <view
                  class="chatbox__search-list-item__content__info-owner MessageItem--chatbox__search-list-item__content__info-owner data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <view
                    class="u-avatar avatar--u-avatar data-v-14a988f2 avatar--data-v-14a988f2 u-avatar--circle avatar--u-avatar--circle"
                    style="background-color: transparent; width: 21px; height: 21px"
                  >
                    <image
                      class="u-avatar__image avatar--u-avatar__image data-v-14a988f2 avatar--data-v-14a988f2 u-avatar__image--circle avatar--u-avatar__image--circle sk-image"
                      mode="scaleToFill"
                      style="width: 21px; height: 21px"
                    ></image>
                  </view>
                  <view
                    class="chatbox__search-list-item__content__info-owner__username MessageItem--chatbox__search-list-item__content__info-owner__username data-v-4c29108f MessageItem--data-v-4c29108f"
                  >
                    <view
                      class="u-text u-text--u-text data-v-5fec1d8b u-text--data-v-5fec1d8b"
                      style="margin: 0; justify-content: flex-start"
                    >
                      <text
                        class="u-text__value u-text--u-text__value data-v-5fec1d8b u-text--data-v-5fec1d8b sk-transparent sk-text-0-0000-595 sk-text"
                        style="
                          text-decoration: none;
                          font-weight: normal;
                          word-wrap: normal;
                          font-size: 12px;
                          color: #303133;
                          line-height: 12px;
                        "
                        >一二三四</text
                      >
                    </view>
                  </view>
                </view>
                <view
                  class="chatbox__search-list-item__content__button MessageItem--chatbox__search-list-item__content__button data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <label
                    class="data-v-4c29108f MessageItem--data-v-4c29108f sk-transparent sk-text-26-0000-517 sk-text"
                    style="background-position-x: 50%"
                    >已失效</label
                  >
                </view>
              </view>
              <view class="data-v-4c29108f MessageItem--data-v-4c29108f">
                <view class="password-popup PasswordPopup--password-popup">
                  <view
                    class="u-popup popup--u-popup data-v-74921bef popup--data-v-74921bef"
                  ></view>
                </view>
              </view>
            </view>
          </view>
          <view class="data-v-d8a8d0ea">
            <view class="data-v-d8a8d0ea">
              <view
                class="chatbox__search-list-item__content MessageItem--chatbox__search-list-item__content data-v-4c29108f MessageItem--data-v-4c29108f"
              >
                <view
                  class="chatbox__search-list-item__content__img MessageItem--chatbox__search-list-item__content__img data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <image
                    lazy-load="true"
                    class="data-v-4c29108f MessageItem--data-v-4c29108f sk-image"
                    style="width: 63px; height: 63px; border-radius: 4px; margin: 6px"
                  ></image>
                </view>
                <view
                  class="chatbox__search-list-item__content__info-name MessageItem--chatbox__search-list-item__content__info-name data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <view
                    class="u-text u-text--u-text data-v-5fec1d8b u-text--data-v-5fec1d8b"
                    style="margin: 0; justify-content: flex-start"
                  >
                    <text
                      class="u-text__value u-text--u-text__value data-v-5fec1d8b u-text--data-v-5fec1d8b sk-transparent sk-text-14-2857-530 sk-text"
                      style="
                        text-decoration: none;
                        font-weight: normal;
                        word-wrap: normal;
                        font-size: 15px;
                        color: #303133;
                      "
                      >虽然叫物品但是是空间</text
                    >
                  </view>
                </view>
                <view
                  class="chatbox__search-list-item__content__info-owner MessageItem--chatbox__search-list-item__content__info-owner data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <view
                    class="u-avatar avatar--u-avatar data-v-14a988f2 avatar--data-v-14a988f2 u-avatar--circle avatar--u-avatar--circle"
                    style="background-color: transparent; width: 21px; height: 21px"
                  >
                    <image
                      class="u-avatar__image avatar--u-avatar__image data-v-14a988f2 avatar--data-v-14a988f2 u-avatar__image--circle avatar--u-avatar__image--circle sk-image"
                      mode="scaleToFill"
                      style="width: 21px; height: 21px"
                    ></image>
                  </view>
                  <view
                    class="chatbox__search-list-item__content__info-owner__username MessageItem--chatbox__search-list-item__content__info-owner__username data-v-4c29108f MessageItem--data-v-4c29108f"
                  >
                    <view
                      class="u-text u-text--u-text data-v-5fec1d8b u-text--data-v-5fec1d8b"
                      style="margin: 0; justify-content: flex-start"
                    >
                      <text
                        class="u-text__value u-text--u-text__value data-v-5fec1d8b u-text--data-v-5fec1d8b sk-transparent sk-text-0-0000-494 sk-text"
                        style="
                          text-decoration: none;
                          font-weight: normal;
                          word-wrap: normal;
                          font-size: 12px;
                          color: #303133;
                          line-height: 12px;
                        "
                        >一二三四</text
                      >
                    </view>
                  </view>
                </view>
                <view
                  class="chatbox__search-list-item__content__button MessageItem--chatbox__search-list-item__content__button data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <label
                    class="data-v-4c29108f MessageItem--data-v-4c29108f sk-transparent sk-text-26-0000-990 sk-text"
                    style="background-position-x: 50%"
                    >已同意</label
                  >
                </view>
              </view>
              <view class="data-v-4c29108f MessageItem--data-v-4c29108f">
                <view class="password-popup PasswordPopup--password-popup">
                  <view
                    class="u-popup popup--u-popup data-v-74921bef popup--data-v-74921bef"
                  ></view>
                </view>
              </view>
            </view>
          </view>
          <view class="data-v-d8a8d0ea">
            <view class="data-v-d8a8d0ea">
              <view
                class="chatbox__search-list-item__content MessageItem--chatbox__search-list-item__content data-v-4c29108f MessageItem--data-v-4c29108f"
              >
                <view
                  class="chatbox__search-list-item__content__img MessageItem--chatbox__search-list-item__content__img data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <image
                    lazy-load="true"
                    class="data-v-4c29108f MessageItem--data-v-4c29108f sk-image"
                    style="width: 63px; height: 63px; border-radius: 4px; margin: 6px"
                  ></image>
                </view>
                <view
                  class="chatbox__search-list-item__content__info-name MessageItem--chatbox__search-list-item__content__info-name data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <view
                    class="u-text u-text--u-text data-v-5fec1d8b u-text--data-v-5fec1d8b"
                    style="margin: 0; justify-content: flex-start"
                  >
                    <text
                      class="u-text__value u-text--u-text__value data-v-5fec1d8b u-text--data-v-5fec1d8b sk-transparent sk-text-14-2857-530 sk-text"
                      style="
                        text-decoration: none;
                        font-weight: normal;
                        word-wrap: normal;
                        font-size: 15px;
                        color: #303133;
                      "
                      >虽然叫物品但是是空间</text
                    >
                  </view>
                </view>
                <view
                  class="chatbox__search-list-item__content__info-owner MessageItem--chatbox__search-list-item__content__info-owner data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <view
                    class="u-avatar avatar--u-avatar data-v-14a988f2 avatar--data-v-14a988f2 u-avatar--circle avatar--u-avatar--circle"
                    style="background-color: transparent; width: 21px; height: 21px"
                  >
                    <image
                      class="u-avatar__image avatar--u-avatar__image data-v-14a988f2 avatar--data-v-14a988f2 u-avatar__image--circle avatar--u-avatar__image--circle sk-image"
                      mode="scaleToFill"
                      style="width: 21px; height: 21px"
                    ></image>
                  </view>
                  <view
                    class="chatbox__search-list-item__content__info-owner__username MessageItem--chatbox__search-list-item__content__info-owner__username data-v-4c29108f MessageItem--data-v-4c29108f"
                  >
                    <view
                      class="u-text u-text--u-text data-v-5fec1d8b u-text--data-v-5fec1d8b"
                      style="margin: 0; justify-content: flex-start"
                    >
                      <text
                        class="u-text__value u-text--u-text__value data-v-5fec1d8b u-text--data-v-5fec1d8b sk-transparent sk-text-0-0000-494 sk-text"
                        style="
                          text-decoration: none;
                          font-weight: normal;
                          word-wrap: normal;
                          font-size: 12px;
                          color: #303133;
                          line-height: 12px;
                        "
                        >一二三四</text
                      >
                    </view>
                  </view>
                </view>
                <view
                  class="chatbox__search-list-item__content__button MessageItem--chatbox__search-list-item__content__button data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <label
                    class="data-v-4c29108f MessageItem--data-v-4c29108f sk-transparent sk-text-26-0000-990 sk-text"
                    style="background-position-x: 50%"
                    >已同意</label
                  >
                </view>
              </view>
              <view class="data-v-4c29108f MessageItem--data-v-4c29108f">
                <view class="password-popup PasswordPopup--password-popup">
                  <view
                    class="u-popup popup--u-popup data-v-74921bef popup--data-v-74921bef"
                  ></view>
                </view>
              </view>
            </view>
          </view>
          <view class="data-v-d8a8d0ea">
            <view class="data-v-d8a8d0ea">
              <view
                class="chatbox__search-list-item__content MessageItem--chatbox__search-list-item__content data-v-4c29108f MessageItem--data-v-4c29108f"
              >
                <view
                  class="chatbox__search-list-item__content__img MessageItem--chatbox__search-list-item__content__img data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <image
                    lazy-load="true"
                    class="data-v-4c29108f MessageItem--data-v-4c29108f sk-image"
                    style="width: 63px; height: 63px; border-radius: 4px; margin: 6px"
                  ></image>
                </view>
                <view
                  class="chatbox__search-list-item__content__info-name MessageItem--chatbox__search-list-item__content__info-name data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <view
                    class="u-text u-text--u-text data-v-5fec1d8b u-text--data-v-5fec1d8b"
                    style="margin: 0; justify-content: flex-start"
                  >
                    <text
                      class="u-text__value u-text--u-text__value data-v-5fec1d8b u-text--data-v-5fec1d8b sk-transparent sk-text-14-2857-530 sk-text"
                      style="
                        text-decoration: none;
                        font-weight: normal;
                        word-wrap: normal;
                        font-size: 15px;
                        color: #303133;
                      "
                      >虽然叫物品但是是空间</text
                    >
                  </view>
                </view>
                <view
                  class="chatbox__search-list-item__content__info-owner MessageItem--chatbox__search-list-item__content__info-owner data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <view
                    class="u-avatar avatar--u-avatar data-v-14a988f2 avatar--data-v-14a988f2 u-avatar--circle avatar--u-avatar--circle"
                    style="background-color: transparent; width: 21px; height: 21px"
                  >
                    <image
                      class="u-avatar__image avatar--u-avatar__image data-v-14a988f2 avatar--data-v-14a988f2 u-avatar__image--circle avatar--u-avatar__image--circle sk-image"
                      mode="scaleToFill"
                      style="width: 21px; height: 21px"
                    ></image>
                  </view>
                  <view
                    class="chatbox__search-list-item__content__info-owner__username MessageItem--chatbox__search-list-item__content__info-owner__username data-v-4c29108f MessageItem--data-v-4c29108f"
                  >
                    <view
                      class="u-text u-text--u-text data-v-5fec1d8b u-text--data-v-5fec1d8b"
                      style="margin: 0; justify-content: flex-start"
                    >
                      <text
                        class="u-text__value u-text--u-text__value data-v-5fec1d8b u-text--data-v-5fec1d8b sk-transparent sk-text-0-0000-494 sk-text"
                        style="
                          text-decoration: none;
                          font-weight: normal;
                          word-wrap: normal;
                          font-size: 12px;
                          color: #303133;
                          line-height: 12px;
                        "
                        >一二三四</text
                      >
                    </view>
                  </view>
                </view>
                <view
                  class="chatbox__search-list-item__content__button MessageItem--chatbox__search-list-item__content__button data-v-4c29108f MessageItem--data-v-4c29108f"
                >
                  <label
                    class="data-v-4c29108f MessageItem--data-v-4c29108f sk-transparent sk-text-26-0000-990 sk-text"
                    style="background-position-x: 50%"
                    >已同意</label
                  >
                </view>
              </view>
              <view class="data-v-4c29108f MessageItem--data-v-4c29108f">
                <view class="password-popup PasswordPopup--password-popup">
                  <view
                    class="u-popup popup--u-popup data-v-74921bef popup--data-v-74921bef"
                  ></view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.sk-transparent {
  color: transparent !important;
}
.sk-text-0-0000-83 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 40rpx;
  position: relative !important;
}
.sk-text {
  background-origin: content-box !important;
  background-clip: content-box !important;
  background-color: transparent !important;
  color: transparent !important;
  background-repeat: repeat-y !important;
}
.sk-text-14-2857-24 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 44.8rpx;
  position: relative !important;
}
.sk-text-0-0000-628 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 52rpx;
  position: relative !important;
}
.sk-opacity {
  opacity: 0 !important;
}
.sk-text-14-2857-796 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 39.2rpx;
  position: relative !important;
}
.sk-text-14-2857-616 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 42rpx;
  position: relative !important;
}
.sk-text-14-2857-956 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 42rpx;
  position: relative !important;
}
.sk-text-0-0000-101 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 24rpx;
  position: relative !important;
}
.sk-text-26-0000-849 {
  background-image: linear-gradient(
    transparent 26%,
    #eeeeee 0%,
    #eeeeee 74%,
    transparent 0%
  ) !important;
  background-size: 100% 50rpx;
  position: relative !important;
}
.sk-text-14-2857-182 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 42rpx;
  position: relative !important;
}
.sk-text-14-2857-411 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 42rpx;
  position: relative !important;
}
.sk-text-0-0000-371 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 24rpx;
  position: relative !important;
}
.sk-text-26-0000-45 {
  background-image: linear-gradient(
    transparent 26%,
    #eeeeee 0%,
    #eeeeee 74%,
    transparent 0%
  ) !important;
  background-size: 100% 50rpx;
  position: relative !important;
}
.sk-text-14-2857-73 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 42rpx;
  position: relative !important;
}
.sk-text-0-0000-941 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 24rpx;
  position: relative !important;
}
.sk-text-26-0000-317 {
  background-image: linear-gradient(
    transparent 26%,
    #eeeeee 0%,
    #eeeeee 74%,
    transparent 0%
  ) !important;
  background-size: 100% 50rpx;
  position: relative !important;
}
.sk-text-14-2857-909 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 42rpx;
  position: relative !important;
}
.sk-text-0-0000-467 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 24rpx;
  position: relative !important;
}
.sk-text-26-0000-80 {
  background-image: linear-gradient(
    transparent 26%,
    #eeeeee 0%,
    #eeeeee 74%,
    transparent 0%
  ) !important;
  background-size: 100% 50rpx;
  position: relative !important;
}
.sk-text-14-2857-443 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 42rpx;
  position: relative !important;
}
.sk-text-0-0000-595 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 24rpx;
  position: relative !important;
}
.sk-text-26-0000-517 {
  background-image: linear-gradient(
    transparent 26%,
    #eeeeee 0%,
    #eeeeee 74%,
    transparent 0%
  ) !important;
  background-size: 100% 50rpx;
  position: relative !important;
}
.sk-text-14-2857-530 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 42rpx;
  position: relative !important;
}
.sk-text-0-0000-494 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 24rpx;
  position: relative !important;
}
.sk-text-26-0000-990 {
  background-image: linear-gradient(
    transparent 26%,
    #eeeeee 0%,
    #eeeeee 74%,
    transparent 0%
  ) !important;
  background-size: 100% 50rpx;
  position: relative !important;
}
.sk-text-14-2857-100 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 42rpx;
  position: relative !important;
}
.sk-text-0-0000-679 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 32rpx;
  position: relative !important;
}
.sk-text-26-0000-362 {
  background-image: linear-gradient(
    transparent 26%,
    #eeeeee 0%,
    #eeeeee 74%,
    transparent 0%
  ) !important;
  background-size: 100% 50rpx;
  position: relative !important;
}
.sk-image {
  background: #efefef !important;
}
.sk-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: transparent;
}
</style>
