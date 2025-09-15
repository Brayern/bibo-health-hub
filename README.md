# The Bibo Project

**Digital Health for All** 🏥✨

The Bibo Project is a comprehensive digital health platform designed to make healthcare accessible, manageable, and community-driven for everyone. Our mission is to democratize health information and tools through technology.

## 🌟 Features

### 🏠 **Dashboard**
- Personalized health overview
- Quick access to key health metrics
- User-friendly interface for health management

### 📚 **Health Information Hub**
- Curated health resources and articles
- Evidence-based health information
- Educational content for better health decisions

### 👥 **Community**
- Connect with others on similar health journeys
- Share experiences and support
- Community-driven health discussions

### ⏰ **Smart Reminders** (Premium Feature)
- Medication reminders
- Appointment notifications
- Custom health routine alerts
- Secure payment integration via Paystack

### 🔐 **Secure Authentication**
- User account management
- Secure sign-in/sign-up process
- Password visibility controls for better UX

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Shadcn/ui** - Beautiful component library
- **Lucide React** - Modern icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication & authorization
  - Edge functions

### Payment Processing
- **Paystack** - Secure payment integration for premium features

### Additional Tools
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **React Query** - Data fetching and caching
- **Sonner** - Toast notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd bibo-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase and Paystack credentials.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Landing page hero
│   └── ...
├── pages/              # Page components
│   ├── Auth.tsx        # Authentication page
│   ├── Dashboard.tsx   # User dashboard
│   ├── Community.tsx   # Community features
│   └── ...
├── hooks/              # Custom React hooks
├── integrations/       # Third-party integrations
│   └── supabase/       # Supabase configuration
└── lib/                # Utility functions
```

## 🎨 Design System

The project uses a carefully crafted design system with:
- **Semantic color tokens** for consistent theming
- **Responsive design** for all screen sizes
- **Dark/light mode support**
- **Accessible components** following WCAG guidelines
- **Smooth animations** for enhanced user experience

## 🔒 Security Features

- **Row Level Security (RLS)** for data protection
- **Secure authentication** with email verification
- **Payment security** through Paystack integration
- **Input validation** with Zod schemas
- **XSS protection** and secure coding practices

## 🚀 Deployment

### Using Lovable (Recommended)
1. Open your [Lovable Project](https://lovable.dev/projects/5a41425a-a1ce-4c99-9c92-7479bd499eae)
2. Click on **Share → Publish**
3. Your app will be deployed instantly!

### Manual Deployment
1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel
   - Netlify
   - GitHub Pages
   - Or any static hosting service

## 🔗 Custom Domain

You can connect a custom domain to your Lovable project:
1. Navigate to **Project > Settings > Domains**
2. Click **Connect Domain**
3. Follow the setup instructions

[Learn more about custom domains](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## 🛠️ Development

### Using Lovable
Visit your [Lovable Project](https://lovable.dev/projects/5a41425a-a1ce-4c99-9c92-7479bd499eae) and start prompting. Changes are automatically committed to your repo.

### Local Development
```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start development server
npm run dev
```

### GitHub Codespaces
1. Navigate to your repository
2. Click the "Code" button
3. Select "Codespaces" tab
4. Click "New codespace"

## 🤝 Contributing

We welcome contributions to The Bibo Project! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you need help or have questions:
- Check our [documentation](docs/)
- Open an issue on GitHub
- Contact our support team

## 🌍 Mission

**"Digital Health for All"** - We believe everyone deserves access to quality health information and tools. The Bibo Project is our contribution to making healthcare more accessible, understandable, and manageable for people everywhere.

---

Built with ❤️ for better health outcomes worldwide.
