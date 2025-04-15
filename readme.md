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
  - 
