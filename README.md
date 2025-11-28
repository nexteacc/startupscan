## StartupScan (Next.js 全栈版)

这是一个用摄像头拍照并调用 AI 生成创业点子分析的 PWA，已经从 “Vite 前端 + 独立 Express 后端” 完整迁移到单一的 Next.js App Router 项目。用户登录（Clerk）后即可拍照，照片上传到 Cloudinary，再通过 `/api/analyze-image` 路由调用 OpenAI（Vision）返回 5 套创业创意卡片。

### 主要技术
- **前端**：Next.js 16（App Router）、React 19、Tailwind CSS、Framer Motion、Styled Components
- **认证**：@clerk/nextjs
- **媒体与上传**：navigator.mediaDevices、react-webcam（CameraView）、Cloudinary 上传 API
- **AI**：OpenAI SDK（`gpt-4o-mini`）+ Structured Outputs (JSON schema)
- **支付**：Creem checkout（`/api/create-checkout-session`）

### 目录结构
```
src/
  app/
    page.tsx                # 首屏逻辑（登录 / 相机 / 结果）
    layout.tsx              # ClerkProvider + 全局样式
    api/
      analyze-image/route.ts
      create-checkout-session/route.ts
      test/route.ts
      test-image/route.ts
  components/               # AuroraBackground / CameraButton / CameraView / ResultsView
  lib/utils.ts
public/                     # PWA manifest + icons
tailwind.config.ts
postcss.config.js
```

### 环境变量
在 `.env.local` 或 Vercel 项目设置中配置（注意 `NEXT_PUBLIC_` 前缀给客户端使用）：

| 变量 | 说明 |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary Upload Preset（需允许 unsigned 上传） |
| `OPENAI_API_KEY` | OpenAI API Key |
| `CREEM_API_KEY` | Creem API Key |

### 本地开发
```bash
npm install
npm run dev
# 浏览器访问 http://localhost:3000
```

### 可用脚本
| 命令 | 说明 |
| --- | --- |
| `npm run dev` | Next.js 开发模式 |
| `npm run lint` | ESLint（已通过） |
| `npm run build` | 生产构建（在当前沙箱因 Turbopack 绑定端口被拒；请在本地或 Vercel 上执行） |
| `npm start` | 构建后启动 |

### 迁移后优势
- 前后端同域，彻底摆脱 CORS 和 `VITE_API_BASE_URL`
- Clerk、Cloudinary、OpenAI、Creem 的配置与部署集中在一个 Next 项目里
- API Routes 直接复用 TypeScript 类型，更易维护和扩展（未来可继续加社区流功能）

如需在此基础上扩展社区卡片、点赞、分享等功能，只需继续在 Next 的 `app/` 下新增页面和 API 路由即可。欢迎继续迭代 🚀
