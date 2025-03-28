# Kudakwashe Taderera - Portfolio Website

A professional portfolio website built with pure HTML, CSS, and JavaScript. This responsive website showcases skills, projects, and experience without any frameworks or libraries (except Font Awesome for icons).

## Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing
- **Modern UI**: Clean and professional interface with UIUC color scheme
- **Animations**: Smooth scroll-triggered animations using Intersection Observer API
- **Interactive Elements**: Project filtering, skill bars, form validation
- **Cross-Browser Compatible**: Works on all modern browsers
- **Fast Performance**: Lightweight with minimal dependencies
- **SEO Friendly**: Proper semantic HTML and meta tags

## Pages

1. **Home**: Introduction, highlighted skills, and featured projects
2. **About**: Background, education, work experience, and detailed skills
3. **Projects**: Filterable gallery of projects with descriptions and technologies
4. **Contact**: Contact form, information, and social media links

## Deployment to GitHub Pages

### Option 1: Manual Deployment

1. Create a new repository on GitHub named `yourusername.github.io`
2. Clone the repository to your local machine
3. Copy all files from this project into your repository folder
4. Push the changes to GitHub:
   ```
   git add .
   git commit -m "Initial portfolio deployment"
   git push origin main
   ```
5. Wait a few minutes, and your site will be live at `https://yourusername.github.io`

### Option 2: Using GitHub Actions

1. Create a new repository on GitHub (can be any name)
2. Create a `.github/workflows/deploy.yml` file with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@4.1.4
        with:
          branch: gh-pages
          folder: .
```

3. Push your code to the repository
4. GitHub Actions will deploy your site to the `gh-pages` branch
5. Go to repository Settings > Pages and select the `gh-pages` branch as the source
6. Your site will be available at `https://yourusername.github.io/repositoryname`

## Customization

- **Colors**: Edit CSS variables in `css/styles.css` under `:root`
- **Content**: Update personal information in HTML files
- **Images**: Replace images in the `assets` directory
- **Projects**: Modify project cards in `projects.html`
- **Contact Form**: For a working contact form, update the form in `contact.html` with a form submission service like Formspree or Netlify Forms

## Credits

- **Icons**: [Font Awesome](https://fontawesome.com/)
- **Fonts**: [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
- **Images**: Custom SVG illustrations

## License

This project is available for personal and commercial use.

---

Made with 💙🧡 by Kudakwashe Taderera