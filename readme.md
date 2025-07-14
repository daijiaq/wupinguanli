# 理物丨物品收纳管理流转

## 主要功能
- **空间/物品管理**：支持空间（如房间、柜子）与物品的分层级管理，可新建、编辑、删除、批量移动。
- **标签与筛选**：为物品添加标签，支持多条件筛选和搜索。
- **物品流转与历史**：记录物品的流转、修改、删除等历史。
- **协同管理**：支持多用户共同管理物品。
- **隐私保护**：支持隐私物品设置、统一密码、手势/数字密码验证。
- **二维码**：为物品生成二维码，便于扫码查找。
- **消息与通知**：集成消息中心，支持系统消息、好友申请、物品分享等。
- **好友与分组**：支持好友管理、分组、分享物品。
- **多端适配**：支持微信小程序、H5、App等多端。

## 技术栈
- [uni-app](https://uniapp.dcloud.io/)（跨端开发框架）
- [Vue 3](https://v3.cn.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)（状态管理）
- [TypeScript](https://www.typescriptlang.org/)
- [uview-plus](https://www.uviewui.com/)（UI组件库）
- [Vite](https://vitejs.dev/)（构建工具）
- [ESLint](https://eslint.org/)、[Prettier](https://prettier.io/)（代码规范）

## 安装与启动

### 环境要求
- Node.js >= 18.12.1
- npm >= 8.19.2

### 安装依赖
```bash
npm install
```

### 启动开发环境
- 微信小程序：
```bash
npm run dev:mp-weixin
```

> 也可使用 HBuilderX 打开项目根目录进行可视化开发和调试。

### 构建发布
- 微信小程序构建：
```bash
npm run build:mp-weixin
```

## 目录结构
```
├── src/
│   ├── App.vue                # 入口组件
│   ├── main.ts                # 入口文件
│   ├── components/            # 通用组件
│   ├── network/               # API 请求
│   ├── pages/                 # 页面目录
│   ├── stores/                # Pinia 状态管理
│   ├── types/                 # TypeScript 类型定义
│   ├── utils/                 # 工具函数
│   ├── static/                # 静态资源
│   └── uni.scss               # 全局样式
├── package.json
├── vite.config.ts
├── tsconfig.json
├── project.config.json        # 小程序配置
├── project.private.config.json
├── index.html
└── readme.md
```

---

## 目录结构详细说明

### src/components
**描述**：存放全局可复用的 Vue 组件。每个子文件夹为一个独立组件，便于维护和复用。
- `Form/`：表单相关组件（如输入框、日期、标签、图片上传等）。
- `Space/`：空间/物品展示相关组件。
- `MessageList/`：消息列表及消息项组件。
- `PasswordPopup/`、`GesturePassword/`、`NumberPassword/`：密码输入与验证相关组件。
- `Tag/`、`SortButton/`、`SearchInput/` 等：标签、排序、搜索等通用功能组件。

#### 代码逻辑详细解释（以 FormInput.vue 为例）
- **功能**：通用表单输入组件，支持文本、数字、金额等多种类型，支持禁用、最大长度、单位显示等。
- **props**：
  - `display`：是否显示输入框（否则显示只读内容）。
  - `unitName`：单位名称（如“元”）。
  - `input`：输入内容，支持双向绑定。
  - `maxLength`：最大输入长度。
  - `disabled`：是否禁用输入。
  - `placeHolder`：占位符。
  - `name`：字段名。
  - `type`：输入类型（text/number/digit等）。
  - `span`：输入框所占列宽。
- **逻辑**：
  - 通过 `v-model` 实现输入内容的双向绑定。
  - `getInputType` 计算属性：若字段为“金额”且类型为 number，则输入类型为 digit（支持小数点）。
  - `changeInput` 方法：输入框失焦时，触发 `update:input` 和 `onLossFocus` 事件，便于父组件同步数据。
  - 支持插槽，可在字段名后自定义图标。
  - 若 `display` 为 false 且禁用，显示只读内容并可点击复制链接。
- **样式**：简单的底部间距，支持自定义扩展。

### src/pages
**描述**：存放所有页面视图，每个子文件夹对应一个页面或页面分组。
- `home/`：首页及空间管理相关页面。
- `login/`：登录相关页面。
- `user/`：用户中心、设置、反馈、历史等页面。
- `message/`：消息中心及聊天相关页面。
- `new/`、`edit/`、`search/`、`square/` 等：新建、编辑、搜索、广场等功能页面。

### src/network
**描述**：API 请求相关代码。
- `index.ts`：请求封装与拦截器。
- `apis/`：按业务模块拆分的 API 文件（如 user.ts、form.ts、space.ts 等）。

### src/stores
**描述**：Pinia 状态管理，按业务模块拆分（如 user、form、space、message、settings、tag、friend、search 等）。

### src/types
**描述**：TypeScript 类型定义，按业务模块拆分，便于类型安全和 IDE 智能提示。

### src/utils
**描述**：工具函数与通用类型定义（如 SDK 封装、通用工具、类型辅助等）。

### src/static
**描述**：静态资源文件夹，包含图片、字体、iconfont 等，按功能或模块分类存放。

### 其他文件
- `App.vue`、`main.ts`：应用入口。
- `uni.scss`：全局样式。
- `manifest.json`、`pages.json`、`project.config.json`：uni-app 配置文件。
- `package.json`、`vite.config.ts`、`tsconfig.json`：依赖、构建、类型配置。

---

# 开发规范

## 代码质量和风格

- 使用 [Eslint](https://eslint.org/) 作为 linter，建议将代码缩进格数设置为 2；

- Eslint  的检查工作流会在代码提交（pre-commit 钩子）时和 Github Actions 中运行并自动修复；


## 提交格式规范

- 使用 commitlint 的配置 [`config-conventional`](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional) 作为提交格式规范，它沿用了 [`Conventional Commits`](https://www.conventionalcommits.org/en/v1.0.0/) 中提到的基础规范，并拓展了 commit message 的 type，对这个 type 的解释可以看 Angular 仓库的[描述](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)。
- 注意，虽然 scope 一般情况下是可选的，但如果所修改的代码位于 client 和 admin 两个包中，就需要指定它们作为 scope。比如，如果修改了 client 下的代码，scope 就需要声明，值为 client。其他情况下可省略；
- 所提交的信息应尽可能地描述清楚所修改的内容和结果，不要怕提交字数过多。另外，提交的粒度也要尽可能地细，例如，如果完成了一次功能开发（type 为 feat），则应在一个组件基本功能完成后或一个 store 封装完成后提交一次；
- 对 commit message 的检查通过 commit-msg 钩子执行，使用 [commitlint](https://github.com/conventional-changelog/commitlint) 运行检查；

## TypeScript 类型规范

- 将所有业务相关的数据封装成 interface 或 type，以业务模块为单位，放到 `types` 目录下，参考该目录下的 user 文件示例。一些暂时用不到或者标明不用管的字段可以不用声明。这些与业务逻辑的数据相关的接口会在封装 api、store 等场景使用；
- 一些常见的数据模型，放在 `types/common` 中，比如 `ResponseTypeWithPages`，应该被用在调用后端接口获取分页数据上；
- 注意，请尽可能少地使用 `any`，只有当目标变量的类型支持不完全并且无法使用 unknown 的情况下才可以使用它，该场景可以参考 `utils/index` 的 resetAllStores 函数；
- 由于项目使用 `unplugin-auto-import` 和 `unplugin-vue-components` 进行 API 和组件的自动导入，当你第一次使用一个刚刚被声明的 API / 组件时对应的声明文件可能未及时更新，这是因为这两个插件需要运行起来才能发挥作用，所以你需要运行 vite 或者 vitest 启动 vite 开发服务器，如果还是不行就重启一下；此外，在默认情况下进入将被自动引入的变量的类型声明位置时只会跳转到这两个插件产生的声明文件，而不是原始的代码，可以安装 `Goto definition alias` VSCode 插件解决这个问题；
- 在单文件组件中，因为项目使用的是 `<script setup>` 语法，在定义 props 和 emit 的类型时支持两种形式，一种是运行时声明，一种是类型声明，在本项目中强制使用类型声明，具体使用方式移步[文档](https://cn.vuejs.org/api/sfc-script-setup.html#typescript-only-features)；

## CSS 类命名规范

- 使用 [BEM](https://getbem.com/) 作为命名规范，具体来说：

  - 单词之间使用 `-` 进行连接，例如：`class="article-list"`；
  - 子元素的类名使用 `__` 与父元素的类名连接：
    - 父：`class="article-list"`；
    - 子：`class="article-list__detail-link"`；
  - 单个元素的不同状态使用 `--` 连接：
    - 初始状态：`class="submit-button"`；
    - 禁用状态：`class="submit-button--disabled"`；

- 在使用 BEM 的情况下，使用 sass 编写样式代码时就可以进行嵌套：

  ```
  <style scoped lang="sass">
  .login-form {
    display: flex;
  
    &__submit-button {
      margin: 20px;
    }
  
    &__submit-button--disabled {
      color: #000;
    }
  }
  </style>
  ```

  注意使用 scoped。

## 图片命名和存放规范

- 图片命名格式不强制要求，但应清楚地表明图片的内容或作用；
- 图片的存放以模块为单位，例如，用户认证模块的图片放在 `/assets/auth/` 目录下；

## 单文件组件代码风格约定

- 单文件组件使用 `<script setup>` 语法，使用组合式 API；

- 除了 [`@antfu/eslint-config`](https://github.com/antfu/eslint-config) 所规定的代码风格外，为了清楚地表明组件的功能及输入输出，方便其他人维护和查看，将输入：`defineProps` 和 `defineEmits` 的调用放在 import 语句之后，还可在其后进行对 useRouter、useRoute 和 useXXStore 的调用。例如：

  ```
  <script setup lang="ts">
  import xx from 'xx'
  
  const props = defineProps<{
    articleId: string
  }>()
  
  const emit = defineEmits<{
    (e: 'fetch', status: boolean): void
  }>()
  
  const router = useRouter()
  const auth = useAuthStore()
  
  // ... 功能代码
  </script>
  ```

  ## 根据版本要求
  - node: 18.12.1 以上
  - npm 8.19.2 以上
  - 推荐淘宝镜像源
  - 建议 vscode 开启 eslint、prettier 插件
