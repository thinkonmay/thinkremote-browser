"use client"
import { useSearchParams } from 'next/navigation';

function Title() {
	const searchParams = useSearchParams();
    const name         = searchParams.get('page') || 'WebRTC remote viewer'
	return ( <title>{name}</title> );
}

export default Title;