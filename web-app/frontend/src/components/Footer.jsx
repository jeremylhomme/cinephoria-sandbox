import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo-light.webp";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-[#fafaf9] py-14 flex-shrink-0">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex mb-4 lg:flex-1">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Cinéphoria</span>
                <img className="h-5 w-auto" src={logo} alt="" />
              </Link>
            </div>
            <p className="text-gray-400 mb-4">
              Cinéphoria est un joyau du cinéma français. Fondé par des
              passionnés de cinéma.
            </p>
            <Link to="/movies" className="text-yellow-600">
              Voir les films
            </Link>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-50 mb-2">
              Liens utiles
            </h3>
            <div>
              <ul className="grid gap-2 text-sm">
                <li>
                  <Link to="/cgv" className="text-gray-400">
                    CGV
                  </Link>
                </li>
                <li>
                  <Link to="/cgu" className="text-gray-400">
                    CGU
                  </Link>
                </li>
                <li>
                  <Link to="/legal-notice" className="text-gray-400">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-gray-400">
                    Politique de confidentialité
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h3 className="text-xl mb-4 text-gray-50 font-semibold">Cinémas</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-white mb-2 text-sm">France</p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/cinema-bordeaux"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      Bordeaux
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cinema-lille"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      Lille
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cinemas/nantes"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      Nantes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cinema-paris"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      Paris
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cinema-toulouse"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      Toulouse
                    </Link>
                  </li>
                </ul>
                <p className="text-white mt-4 mb-2 text-sm">Belgique</p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/cinema-charleroi"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      Charleroi
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cinema-liege"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      Liège
                    </Link>
                  </li>
                </ul>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
