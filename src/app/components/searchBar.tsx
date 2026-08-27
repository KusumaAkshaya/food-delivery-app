'use client'
import { div } from "framer-motion/client"
import {useRouter} from "next/navigation"
import {useState, useEffect} from "react"


export default function SearchBar()
{
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    useEffect(() => {
    const checkAuth = async () => {
        try{
            const baseUrl = "http://localhost:5000";
             const res = await fetch(
                `${baseUrl}/users/me`,
                {
                    method: "GET",
                    credentials: "include",
                }
             );

             if(res.ok)
             {
                setIsLoggedIn(true);
             }

             else{
                console.log('not logged in')
                setIsLoggedIn(false);
             }

        }

        catch(e)
        {
            console.log(
                "auth check failed: ",
                e
            );
            setIsLoggedIn(false);
        }
    }

    checkAuth();
    }, [])

    const handleSearch = (e:any) => 
    {
        e.preventDefault();
        const query = e.target.elements.search.value;

        if(!isLoggedIn)
        {
            console.log(isLoggedIn)
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
