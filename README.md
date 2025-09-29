Next.js 專案設定與教學
這是一個使用 create-next-app 初始化建置的 Next.js 專案。
開始使用
1. 下載專案
請按照以下步驟下載並設置專案：
# 複製專案到本地
git clone <repository-url>
# 進入專案目錄
cd HIZ/hiz-form
# 安裝相依套件
npm install
# 或
yarn install
# 或
pnpm install
# 或
bun install

2. 設定環境變數
專案包含一個 .env.template 檔案，用於配置環境變數。請按照以下步驟建立 .env 檔案：

找到專案根目錄下的 .env.template 檔案，內容如下：PORT=3001


複製 .env.template 檔案並重新命名為 .env：cp .env.template .env


根據需要修改 .env 檔案中的環境變數（例如，保留 PORT=3001 或根據需求更改端口號）。

3. 啟動開發伺服器
運行以下命令以啟動開發伺服器：
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev

啟動後，打開瀏覽器並訪問 http://localhost:3001（或您在 .env 中設定的端口號），即可查看專案運行結果。
4. 編輯頁面
您可以通過修改 app/page.tsx 檔案來編輯頁面內容。頁面會在您編輯檔案時自動更新。
本專案使用 next/font 自動優化並載入 Geist，這是 Vercel 提供的新字型家族。
學習更多
想了解更多關於 Next.js 的資訊，請參考以下資源：

Next.js 官方文件 - 了解 Next.js 的功能與 API。
學習 Next.js - 互動式 Next.js 教學。

您也可以查看 Next.js GitHub 儲存庫，歡迎提供您的反饋與貢獻！
部署到 Vercel
部署 Next.js 應用程式最簡單的方式是使用 Next.js 創建者提供的 Vercel 平台。
更多部署詳情，請參閱 Next.js 部署文件。