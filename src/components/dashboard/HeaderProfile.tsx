import { Menu, Transition } from '@headlessui/react'
import React, { FC, Fragment, useContext } from "react"
import {  IoAddCircleOutline, IoPower } from "react-icons/io5";
import { signOut } from "next-auth/client";
import { useRouter } from 'next/router';
import { Switch } from '@headlessui/react';
import { DarkModeContext } from '../../hooks/DarkModeContext';


const HeaderProfile:FC<{
	headerProfileImageUrl: string | null | undefined
}> = ({ 
	headerProfileImageUrl
}) => {
	const router = useRouter();
	const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

	return (
    <Menu as="div" className="relative inline-block text-left">
			<Menu.Button className="inline-flex justify-center w-full text-sm font-medium text-white bg-black rounded-full bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
				<img
					alt="Profile Image"
					src={headerProfileImageUrl!}
					style={{
						height: '36',
						width: '36',
					}}
					className="h-9 w-9 rounded-full hover:opacity-30"
					/>
				</Menu.Button>
 			<Transition
			    as={Fragment}
          enter="transition ease-out duration-50"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-25"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
				<Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
				<div className="px-1 py-1 ">
				<Menu.Item>
        {({ active }) => (
					<button
						className={`${
							active ? 'bg-gray-500 text-white' : 'text-gray-900'
						} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
						onClick={() => {
							router.push('/teams/create')
						}}
					>
						<IoAddCircleOutline
							className="w-5 h-5 mr-2 text-violet-400"
							aria-hidden="true"	
						/>
					{ `Create a Team` }
					</button>
				)}
        </Menu.Item>
					<Menu.Item>
					{({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-500 text-white' : 'text-gray-900'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
										onClick={() => { signOut({
											callbackUrl: '/',
											redirect: true
										}) }}
                  >
										<IoPower 
									     className="w-5 h-5 mr-2 text-violet-400"
											 aria-hidden="true"	
										/>
                    Sign Out
                  </button>
                )}
					</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	)
}

export default HeaderProfile;
