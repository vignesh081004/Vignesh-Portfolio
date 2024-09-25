import React from "react";
import Hero from '@/components/Blocks/Hero/Hero';
import Education from "@/components/Blocks/Education/Education";
import Resume from "@/components/Blocks/Resume/Resume";
import SkillSet from "@/components/Blocks/SkillSet/SkillSet";
import BoldTitle from "@/components/UI/Cards/BoldTitle/BoldTitle";

export default function Home() {
    return (
        <>
            <Hero/>
            <SkillSet/>
            <Education/>
            <BoldTitle/>
            <Resume/>
        </>
    )
}
