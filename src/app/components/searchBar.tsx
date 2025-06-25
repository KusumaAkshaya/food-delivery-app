'use client'
import { div } from "framer-motion/client"
import {useRouter} from "next/navigation"

export default function SearchBar()
{
    const router = useRouter();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    const handleSearch = (e:any) => 
    {
        e.preventDefault();
        const query = e.target.elements.search.value;

        if(!isLoggedIn)
        {
            router.push('/login');
            return;
        }

        router.push(`search?query=${query}`)
    }

    return(
        <form className="w-full m-2 rounded-lg" onSubmit={handleSearch} >
            <input placeholder="Search here.. " className="bg-white text-black border-1 p-1 rounded-lg w-4/5 m-2" type="text" name="search" />
        </form>
    )
}
