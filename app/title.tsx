"use client"
import { useSearchParams } from 'next/navigation';

function Title() {
	const searchParams = useSearchParams();
    const name         = searchParams.get('page') ?? undefined
	return ( <title>{name == undefined ? 'WebRTC remote viewer' : name}</title> );
}

export default Title;