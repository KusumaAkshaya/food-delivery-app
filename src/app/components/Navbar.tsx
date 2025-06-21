import Link from 'next/link';

export default function Navbar()
{
    return(
        <nav className="flex flex-row-reverse w-full top-0 start-0 p-10" style={{backgroundImage : 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))'}}>
        <div className="space-x-8">
            <Link href="/" className="text-white" >Home</Link>
            <Link href="/login" className="text-white" >Login</Link>
            <Link href="/register" className="text-white" >Register</Link>
            <Link href="/cart" className="text-white" >Cart</Link>
        </div>
        </nav>
    )
}