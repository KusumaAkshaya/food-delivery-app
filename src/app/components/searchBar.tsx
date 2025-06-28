'use client'
import { div } from "framer-motion/client"
import {useRouter} from "next/navigation"
import {useState, useEffect} from "react"


export default function SearchBar()
{
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSearch = (e:any) => 
    {
        e.preventDefault();
        const query = e.target.elements.search.value;
        const status = localStorage.getItem('isLoggedIn') === 'true';

        if(!status)
        {
            router.push('/login');
            return;
        }

        router.push(`search?query=${query}`)
    }

    return(
        <form className="w-full" onSubmit={handleSearch} >
            <input placeholder="Search here..  " className="bg-white text-black border-1 p-1 rounded-2xl w-95/100 m-2 focus-none " type="text" name="search" />
        </form>
    )
}
