import React from 'react'
import { Link } from 'react-router-dom'
import { Music, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                                <Music className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">Stratford Music Platform</span>
                        </Link>
                        <p className="text-gray-300 mb-4 max-w-md">
                            Discover the vibrant music and arts scene in Stratford, Ontario. From live performances
                            to cultural events, connect with the local creative community.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/events" className="text-gray-300 hover:text-white transition-colors">
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link to="/venues" className="text-gray-300 hover:text-white transition-colors">
                                    Venues
                                </Link>
                            </li>
                            <li>
                                <Link to="/magazine" className="text-gray-300 hover:text-white transition-colors">
                                    Magazine
                                </Link>
                            </li>
                            <li>
                                <Link to="/playlists" className="text-gray-300 hover:text-white transition-colors">
                                    Playlists
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-2 text-gray-300">
                                <MapPin className="w-4 h-4" />
                                <span>Stratford, Ontario</span>
                            </li>
                            <li className="flex items-center space-x-2 text-gray-300">
                                <Mail className="w-4 h-4" />
                                <a href="mailto:info@stratfordmusic.com" className="hover:text-white transition-colors">
                                    info@stratfordmusic.com
                                </a>
                            </li>
                            <li className="flex items-center space-x-2 text-gray-300">
                                <Phone className="w-4 h-4" />
                                <a href="tel:+1-519-555-0123" className="hover:text-white transition-colors">
                                    (519) 555-0123
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} Stratford Music Platform. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer 