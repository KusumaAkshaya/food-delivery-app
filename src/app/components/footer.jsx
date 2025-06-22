'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faTwitter, faWhatsapp} from '@fortawesome/free-brands-svg-icons';

export default function Footer()
{
    return(
        <footer className="bg-gray-100 p-10 lg:flex flex-row justify-around" >
             <p className="text-gray-600 text-2xl font-bold" >FoodieExpress</p>
             <div className="flex flex-col sm:pl-1/2 sm:flex-row justify-between p-5 lg:gap-20" >
                <div className="flex flex-col" >
                    <h2 className="text-2xl text-gray-500" >Contact us</h2>
                    <ul className="text-gray-400" > 
                        <li>Help&Support</li>
                        <li>Partner With Us</li>
                        <li>Team</li>
                    </ul>
                </div>
                <div className="flex flex-col"  >
                    <h2 className="text-2xl text-gray-500 " >Legal</h2>
                    <ul className="text-gray-400" >
                        <li>Terms</li>
                        <li>Privacy Policy</li>
                        <li>Cookie Policy</li>
                    </ul>
                </div>
                 <div className="flex flex-col"  >
                    <h2 className="text-2xl text-gray-500 " >Available in</h2>
                    <ul className="text-gray-400" >
                        <li>Hyderabad</li>
                        <li>Kolkata</li>
                        <li>Mumbai</li>
                        <li>Pune</li>
                        <li>Delhi</li>
                        <li>Bangalore</li>
                    </ul>
                </div>
             </div>
             <div className="flex flex-col items-center" >
                <h2 className="text-2xl text-gray-500 " >Connect with Us</h2>
                <ul className="flex flex-row gap-5 text-2xl text-gray-500" >
                    <li><FontAwesomeIcon icon={faWhatsapp} /></li>
                    <li><FontAwesomeIcon icon={faTwitter} /></li>
                    <li> <FontAwesomeIcon icon={faFacebook} /></li>
                    <li><FontAwesomeIcon icon={faInstagram} /></li>
                </ul>
             </div>
        </footer>
    )
}