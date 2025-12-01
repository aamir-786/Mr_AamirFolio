# 👨‍💻 Aamir Hussain - Portfolio Website

![Portfolio Preview](https://img.shields.io/badge/Portfolio-Live-brightgreen) ![Status](https://img.shields.io/badge/Status-Active-success) ![License](https://img.shields.io/badge/License-MIT-blue)

A modern, responsive portfolio website showcasing my projects, skills, and professional experience as a Full Stack Developer. Built with HTML, CSS, JavaScript, and powered by Supabase for backend services.

## 🚀 Live Demo

[**Visit Portfolio →**](https://mr-aamir-folio.vercel.app)

## 👋 About Me

I am **Aamir Hussain**, a skilled Web Developer, Web Designer, and Software Engineer with expertise in Java and Web development. With 2.5+ years of experience in Java and web development, I focus on creating efficient, high-performance applications.

### Skills & Expertise
- **Backend Development**: Java, JavaFX, Java Swing, Maven
- **Frontend Development**: HTML, CSS, JavaScript, jQuery, Bootstrap
- **Full Stack Development**: End-to-end application development
- **Database**: Supabase (PostgreSQL)
- **Tools**: Git, GitHub, Vercel

### Professional Services
- Web Development & Design
- Java Programming
- Responsive Design
- Software Engineering
- Full Stack Solutions

## ✨ Features

### 🎨 Frontend Features
- **Responsive Design**: Fully responsive layout that works on all devices (desktop, tablet, mobile)
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Dynamic Content**: Projects and reviews loaded dynamically from Supabase
- **Project Filtering**: Filter projects by category (All, Web Development, Java Development, Web + PHP, Web + Python)
- **Pagination**: "See More" button to load additional projects
- **Project Details**: Detailed view for each project with images and descriptions
- **Contact Form**: Functional contact form with green success animation
- **Dynamic Counters**: Auto-incrementing counters for Works Completed, Years of Experience, Total Clients, and Awards Won

### 🔐 Admin Features
- **Secure Login**: Authentication system for admin access
- **Project Management**: Add, edit, and delete projects
- **Review Management**: Manage client testimonials and reviews
- **Image Upload**: Direct upload to Supabase Storage
- **Category Management**: Organized project categories stored in JSON

### 🗄️ Backend Features
- **Supabase Integration**: PostgreSQL database for data storage
- **Supabase Storage**: Image storage and management
- **Row Level Security (RLS)**: Secure database access policies
- **RESTful API**: RESTful endpoints for CRUD operations
- **Real-time Updates**: Dynamic content loading from database

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom styling with animations
- **JavaScript (ES6+)**: Interactive functionality
- **jQuery**: DOM manipulation and AJAX
- **Bootstrap 4**: Responsive grid system and components
- **Ionicons**: Icon library
- **Font Awesome**: Additional icons
- **Animate.css**: CSS animations

### Backend
- **Supabase**: Backend as a Service (BaaS)
  - PostgreSQL Database
  - Storage Buckets
  - Row Level Security
  - RESTful API

### Deployment
- **Vercel**: Hosting and deployment
- **Git**: Version control
- **GitHub**: Code repository

## 📁 Project Structure

```
Mr_Aamirfolio/
├── admin/                    # Admin dashboard files
│   ├── admin.js             # Admin functionality
│   └── admin.css            # Admin styles
├── contactform/             # Contact form
│   └── contactform.js       # Form submission logic
├── css/                     # Stylesheets
│   └── style.css           # Main stylesheet
├── data/                    # Data files
│   └── categories.json     # Project categories
├── img/                     # Images and assets
├── js/                      # JavaScript files
│   ├── supabase-service.js # Supabase API wrapper
│   ├── portfolio-loader.js # Portfolio loading logic
│   ├── counter-service.js  # Dynamic counters
│   ├── auth-service.js     # Authentication
│   └── main.js             # Main application logic
├── lib/                     # Third-party libraries
├── supabase/                # Supabase configuration
│   └── functions/
│       └── FIX-CONTACT-FORM.sql
├── index.html              # Main portfolio page
├── project-details.html    # Project detail page
├── admin-dashboard.html    # Admin dashboard
├── admin-login.html        # Admin login page
├── config.js               # Configuration (not in repo)
└── config.example.js       # Configuration example
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Supabase account (for backend services)
- Text editor or IDE (VS Code recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aamir-786/Mr_AamirFolio.git
   cd Mr_AamirFolio/Mr_Aamirfolio
   ```

2. **Set up Supabase**
   - Create a Supabase account at [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key from Settings → API

3. **Configure the application**
   - Copy `config.example.js` to `config.js`
   - Update `config.js` with your Supabase credentials:
   ```javascript
   window.CONFIG = {
     SUPABASE_URL: 'https://your-project.supabase.co',
     SUPABASE_ANON_KEY: 'your-anon-key-here'
   };
   ```

4. **Set up the database**
   - Go to Supabase Dashboard → SQL Editor
   - Run the SQL script in `supabase/functions/FIX-CONTACT-FORM.sql` to set up the contact form table
   - Create tables for `projects` and `reviews` (see database schema below)

5. **Set up Storage**
   - Create a storage bucket named `portfolio-images` in Supabase Storage
   - Set appropriate RLS policies for public read access

6. **Run locally**
   - Open `index.html` in your browser, or
   - Use a local server (VS Code Live Server, Python `http.server`, etc.)

## 🗄️ Database Schema

### Projects Table
```sql
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  image TEXT,
  description TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```


### Reviews Table
```sql
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Contact Messages Table
```sql
CREATE TABLE contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT false
);
```


## 📝 Configuration

### Categories
Edit `data/categories.json` to customize project categories:
```json
{
  "categories": [
    "Web Development",
    "Java Development",
    "Web + PHP",
    "Web + Python"
  ]
}
```

### Dynamic Counters
Edit `js/counter-service.js` to customize counter values:
```javascript
const COUNTER_CONFIG = {
  worksCompleted: 69,
  yearsExperience: 3.0,
  totalClients: 13,
  awardsWon: 11
};
```

## 🎯 Usage

### Admin Dashboard
1. Navigate to `/admin-login.html`
2. Log in with your credentials
3. Manage projects and reviews from the dashboard

### Adding a Project
1. Log in to the admin dashboard
2. Click "Add Project"
3. Fill in project details (title, category, date, image, description, URL)
4. Upload an image (stored in Supabase Storage)
5. Save the project

### Contact Form
- Visitors can submit messages through the contact form
- Messages are stored in the `contact_messages` table
- Success message appears with green animation

## 🔒 Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Authentication**: Secure admin login system
- **Input Validation**: Client-side and server-side validation
- **HTTPS**: All communications encrypted (when deployed)

## 🌐 Deployment

This project is deployed on **Vercel**:
1. Connect your GitHub repository to Vercel
2. Configure environment variables (if needed)
3. Deploy automatically on every push to main branch

## 📧 Contact

- **Email**: [aamir.fss22@gmail.com](mailto:aamir.fss22@gmail.com)
- **Phone**: 0316-3600793
- **Location**: 100ft. road near Sukkur IBA University, Sukkur Sindh
- **GitHub**: [@aamir-786](https://github.com/aamir-786)
- **LinkedIn**: [Aamir Hussain](https://www.linkedin.com/in/aamir-hussain-b0b3bb234)
- **Facebook**: [Amir Hussain Mangrio](https://www.facebook.com/amirhussain.mangrio.737)
- **Instagram**: [@aamirmangrio786](https://www.instagram.com/aamirmangrio786/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Bootstrap for the responsive framework
- Supabase for backend services
- Vercel for hosting
- All the open-source libraries and frameworks used in this project

## 📈 Future Improvements

- [ ] Add blog section
- [ ] Implement dark mode
- [ ] Add project search functionality
- [ ] Multi-language support
- [ ] Performance optimizations
- [ ] Additional animations and transitions

---

**Made by Aamir Hussain**

*Last updated: 20th November 2025*

