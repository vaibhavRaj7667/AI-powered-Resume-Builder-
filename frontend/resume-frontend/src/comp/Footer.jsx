import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import "../Css/footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="fcontainer">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="footer-title">ResumeAI</h3>
            <p className="footer-description">
              Building the future of resume creation with AI-powered tools that help you land your dream job.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <Twitter className="social-icon" />
              </a>
              <a href="#" className="social-link">
                <Facebook className="social-icon" />
              </a>
              <a href="#" className="social-link">
                <Instagram className="social-icon" />
              </a>
              <a href="#" className="social-link">
                <Linkedin className="social-icon" />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Product</h3>
            <ul className="footer-menu">
              <li>
                <a href="#" className="footer-link">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Templates
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Examples
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Resources</h3>
            <ul className="footer-menu">
              <li>
                <a href="#" className="footer-link">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Career Tips
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Resume Guide
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Company</h3>
            <ul className="footer-menu">
              <li>
                <a href="#" className="footer-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
        </div>
      </div>

      {/* Colorful glow effects */}
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>
      <div className="glow glow-3"></div>
    </footer>
  )
}
