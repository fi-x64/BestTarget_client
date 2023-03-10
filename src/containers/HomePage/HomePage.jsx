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
        <div>
            <Banner />
            <Categories />
            <Interest />
            <Description />
            <Keywords />
        </div>
    )
}

export default HomePage
