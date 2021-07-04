import React from "react";
import { docsLink, productCTA, productCTASubtext } from "../../config";
import { Header } from "./Header";
import Link from 'next/link';

const empty: React.ReactNode[] = []
export default function SplashIndex() {
	
	return (
		<>
			<Header />
        <section className="text-gray-600 body-font">
          <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
            <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
              <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">{ productCTA.split('\n').reduce((prev, next) =>{
								return [...prev, <span key={next}>{next}</span>, <br key={next + 'space'} className="hidden lg:inline-block" /> ]
							}, empty) }
              </h1>
              <p className="mb-8 leading-relaxed">{productCTASubtext}</p>
              <div className="flex justify-center">
								<Link 
									href={'/api/auth/signin'}	
								>
                	<a className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Sign Up!</a>
								</Link>
								<Link 
									href={docsLink}	
								>
                <a target={`_blank`} rel={`noopener`} className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Check out the Docs!</a>
								</Link>
              </div>
            </div>
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
              <img className="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600" />
            </div>
          </div>
        </section>
			</>
	);
};
