import React from 'react'
import HomeFooter from './HomeFooter'
import HomeHeader from './HomeHeader'
import Banner from './Section/Banner'
import Categories from './Section/Categories'
import Description from './Section/Description'
import Interest from './Section/Interest'
import Keywords from './Section/Keywords'

function HomePage() {
    return (
        <div className='bg-[#f4f4f4]'>
            <HomeHeader />
            <div className='max-w-[936px] mx-auto'>
                <Banner />
                <Categories />
                <Interest />
                <Description />
                <Keywords />
                <HomeFooter />
            </div>
        </div>
    )
}

export default HomePage
