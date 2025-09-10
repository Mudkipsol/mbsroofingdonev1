# MBS Roofing Website

A modern, full-featured roofing company website built with Next.js, featuring an inventory management system, shopping cart, and admin panel.

## Features

- 🛒 **Product Inventory System**: Browse products by categories (shingles, underlayment, flashings, etc.)
- 🛍️ **Shopping Cart**: Add products to cart with quantity management
- 👤 **User Authentication**: Sign up and login functionality
- 🔐 **Admin Panel**: Password-protected inventory management (password: `MBS2024admin`)
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- ⚡ **Fast Performance**: Optimized with Next.js 15 and React 19

## Tech Stack

- **Framework**: Next.js 15.3.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Package Manager**: Bun
- **Deployment**: Netlify-ready

## Getting Started

### Prerequisites

- Node.js 18+ or Bun installed
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Mudkipsol/mbswebsitedone.git
cd mbswebsitedone
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

3. Run the development server:
```bash
bun run dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── page.tsx      # Home page
│   │   ├── inventory/    # Inventory browsing
│   │   ├── cart/         # Shopping cart
│   │   ├── admin/        # Admin dashboard
│   │   └── ...
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── ...
│   ├── context/         # React context providers
│   └── lib/             # Utility functions
├── public/              # Static assets
└── ...
```

## Key Pages

- **Home** (`/`): Landing page with hero video and company information
- **Inventory** (`/inventory`): Browse all products by category
- **Cart** (`/cart`): View and manage shopping cart
- **Admin** (`/admin`): Admin dashboard for inventory management

## Admin Access

To access the admin features:

1. Navigate to the inventory page (`/inventory`)
2. Enter the admin password: `MBS2024admin`
3. Click "Admin Edit" to enable editing mode

Admin features include:
- Edit product details (name, price, stock)
- Add new products
- Delete products
- Manage categories and brands

## Deployment

### Deploy to Netlify

The project includes a `netlify.toml` configuration file for easy deployment:

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Deploy with these settings:
   - Build command: `bun run build`
   - Publish directory: `out`

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy with default Next.js settings

## Environment Variables

No environment variables are required for basic functionality. The project uses localStorage for data persistence.

## Development Notes

- Stock numbers are stable and persist across page reloads
- Shopping cart data is stored in localStorage
- Admin changes are saved to localStorage
- All product images are hosted externally

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software for MBS Roofing Company.

## Support

For support, please contact the development team or open an issue in the GitHub repository.

---

🤖 Generated with [Same](https://same.new)
