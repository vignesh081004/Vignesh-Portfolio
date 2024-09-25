'use client';

import React, {useRef, useState} from 'react';

import styles from './SkillSet.module.scss';

import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import {Draggable} from "gsap/Draggable";
import {InertiaPlugin} from "gsap/InertiaPlugin";
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import {ScrollTrigger} from "gsap/ScrollTrigger";

import Title from "@/components/UI/Elements/Title/Title";
import Skills from '@/database/Skills.json';
import Blobs from "@/components/UI/Elements/Blobs/Blobs";
import Image from "next/image";
import Ticker from "@/components/UI/Elements/Ticker/Ticker";

export default function SkillSet() {
    gsap.registerPlugin(Draggable, InertiaPlugin, MotionPathPlugin, ScrollTrigger);

    const container = useRef();
    const collisionDiv = useRef();
    const sphere = useRef();
    const [activeIndex, setActiveIndex] = useState(null);
    const [dragStatus, setDragStatus] = useState(null);

    // GSAP Animations
    useGSAP(() => {
        const boxes = gsap.utils.toArray(`.${styles.box}`);

        const handleResize = () => {
            // MotionPath
            gsap.set(boxes, {
                motionPath: {
                    path: "#circularCarouselPath",
                    align: "#circularCarouselPath",
                    alignOrigin: [0.5, 0.5],
                    start: -0.25,
                    end: (i) => i / boxes.length - 0.25,
                    autoRotate: true
                }
            });
        };

        // Draggable
        setActiveIndex(0);
        Draggable.create(`.${styles.circularCarousel}`, {
            type: "rotation",
            inertia: true,
            snap: (endVal) => gsap.utils.snap(360 / boxes.length, endVal),
            onPress: () => {
                setDragStatus('pressed');
            },
            onRelease: () => {
                setDragStatus(null);
            },
            onDragStart: () => {
                setActiveIndex(null);
            },
            onThrowComplete: () => {
                let collisionDivRect = collisionDiv.current?.getBoundingClientRect();
                let newActiveIndex = null;

                boxes.forEach((box, index) => {
                    let boxRect = box.getBoundingClientRect();
                    if (
                        collisionDivRect.x < boxRect.x + boxRect.width &&
                        collisionDivRect.x + collisionDivRect.width > boxRect.x &&
                        collisionDivRect.y < boxRect.y + boxRect.height &&
                        collisionDivRect.y + collisionDivRect.height > boxRect.y
                    ) {
                        newActiveIndex = index;
                    }
                });
                setActiveIndex(newActiveIndex);
            },
        });

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, { scope: container });


    return (
        <>
            <section className={`${styles.section}`} id={'skills'} ref={container}>
                <div className={styles.blobs}>
                    <Blobs type={'v2'} classVariable={`${styles.blob} ${styles.blobV2}`}/>
                    <Blobs type={'v1'} classVariable={`${styles.blob} ${styles.blobV1}`}/>
                </div>
                <div className={styles.grid}>
                    <Title color={'white'}><span>My</span> <br/> Skillset</Title>
                    <div className={styles.circularCarouselWrapper}>
                        <div className={styles.collisionDiv} ref={collisionDiv}></div>
                        <div className={styles.circularCarousel}>
                            <svg viewBox="0 0 400 400">
                                <path strokeWidth="2" stroke="red" id="circularCarouselPath" fill="none"
                                      d="M396,200 C396,308.24781 308.24781,396 200,396 91.75219,396 4,308.24781 4,200 4,91.75219 91.75219,4 200,4 308.24781,4 396,91.75219 396,200 z"></path>
                            </svg>
                            {Skills.map((skill, index) => (
                                <div key={index}
                                     className={`${styles.box} ${activeIndex === index ? styles.isActive : ''}`}>
                                    <Image className={styles.image} src={skill.image} alt={skill.title} width={80}
                                           height={80}
                                           loading={'lazy'}/>
                                </div>
                            ))}
                        </div>
                        {Skills.map((skill, index) => (
                            <div key={index}
                                 className={`${styles.circularDescriptions} ${activeIndex === index ? styles.isActive : ''}`}>
                                <h2 className={styles.title}>{skill.title} <br/> {skill.subtitle}</h2>
                                <p className={styles.description}>{skill.description}</p>
                            </div>
                        ))}

                        <div className={styles.dragMe}>
                            <svg width="301" height="161" viewBox="0 0 301 161" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M215.609 128.362C215.609 130.082 214.749 132.142 213.029 134.542C211.669 137.582 210.049 142.422 208.169 149.062C207.649 150.982 207.029 152.842 206.309 154.642C204.869 158.282 202.649 160.102 199.649 160.102C196.689 160.102 194.269 159.382 192.389 157.942C190.549 156.542 189.629 155.062 189.629 153.502C189.629 153.142 189.749 152.742 189.989 152.302C190.229 151.862 190.509 151.642 190.829 151.642C191.149 151.642 191.549 151.922 192.029 152.482C192.549 153.082 193.029 153.722 193.469 154.402C193.949 155.082 194.709 155.702 195.749 156.262C196.789 156.862 197.829 157.162 198.869 157.162C199.909 157.162 200.709 156.942 201.269 156.502C201.869 156.062 202.369 155.502 202.769 154.822C203.169 154.182 203.569 153.262 203.969 152.062C204.409 150.902 204.769 149.802 205.049 148.762C206.049 145.042 206.829 142.282 207.389 140.482C203.989 143.282 201.109 144.682 198.749 144.682C196.909 144.682 195.289 143.982 193.889 142.582C192.529 141.142 191.849 139.542 191.849 137.782C191.849 135.182 192.689 132.142 194.369 128.662C196.049 125.182 198.209 122.142 200.849 119.542C203.489 116.902 205.929 115.582 208.169 115.582C210.449 115.582 212.149 116.662 213.269 118.822C214.429 120.982 215.009 123.262 215.009 125.662V126.262C215.409 126.782 215.609 127.482 215.609 128.362ZM198.569 141.142C201.009 141.142 203.589 139.882 206.309 137.362C209.069 134.842 211.189 131.622 212.669 127.702C212.389 127.222 212.149 126.462 211.949 125.422C211.469 122.222 210.809 120.282 209.969 119.602C209.609 119.282 209.149 119.122 208.589 119.122C206.869 119.122 204.949 120.282 202.829 122.602C200.709 124.922 198.929 127.582 197.489 130.582C196.049 133.542 195.329 136.022 195.329 138.022C195.329 138.942 195.649 139.702 196.289 140.302C196.929 140.862 197.689 141.142 198.569 141.142Z"
                                    fill="white"/>
                                <path
                                    d="M179.957 115.582C182.037 115.582 183.637 116.442 184.757 118.162C185.917 119.882 186.497 121.442 186.497 122.842C186.497 124.202 186.057 125.482 185.177 126.682C185.537 127.082 185.717 127.602 185.717 128.242C185.717 130.802 185.497 133.222 185.057 135.502C184.657 137.782 184.397 139.602 184.277 140.962C184.157 142.322 184.017 143.282 183.857 143.842C183.737 144.402 183.497 144.682 183.137 144.682C182.457 144.682 182.017 144.042 181.817 142.762C181.617 141.442 181.517 139.422 181.517 136.702C180.277 138.902 178.697 140.782 176.777 142.342C174.897 143.902 173.037 144.682 171.197 144.682C169.397 144.682 167.657 143.982 165.977 142.582C164.297 141.182 163.457 139.642 163.457 137.962C163.457 135.402 164.337 132.362 166.097 128.842C167.897 125.282 170.137 122.182 172.817 119.542C175.497 116.902 177.877 115.582 179.957 115.582ZM183.377 125.962C183.337 125.682 183.317 125.022 183.317 123.982C183.317 122.902 183.077 121.822 182.597 120.742C182.157 119.662 181.477 119.122 180.557 119.122C179.037 119.122 177.197 120.282 175.037 122.602C172.917 124.882 171.077 127.542 169.517 130.582C167.957 133.582 167.177 136.062 167.177 138.022C167.177 138.902 167.577 139.642 168.377 140.242C169.217 140.842 170.097 141.142 171.017 141.142C173.097 141.142 175.217 139.802 177.377 137.122C179.537 134.442 181.177 131.142 182.297 127.222C182.417 126.542 182.777 126.122 183.377 125.962Z"
                                    fill="white"/>
                                <path
                                    d="M150.41 121.402L150.29 118.162C150.29 116.802 150.39 116.042 150.59 115.882C150.79 115.682 150.99 115.582 151.19 115.582C151.75 115.582 152.31 116.002 152.87 116.842C153.43 117.682 153.71 118.582 153.71 119.542C153.71 122.102 153.49 124.662 153.05 127.222C154.25 124.702 155.53 122.542 156.89 120.742C158.25 118.902 159.51 117.622 160.67 116.902C161.83 116.182 162.87 115.822 163.79 115.822C165.55 115.822 166.43 116.182 166.43 116.902C166.43 117.422 165.81 117.942 164.57 118.462C162.21 119.382 160.31 120.822 158.87 122.782C157.43 124.702 156.01 127.202 154.61 130.282C153.21 133.322 152.13 136.042 151.37 138.442C150.65 140.842 150.11 142.522 149.75 143.482C149.39 144.442 148.93 144.922 148.37 144.922C147.93 144.922 147.55 144.642 147.23 144.082C146.91 143.522 146.75 142.982 146.75 142.462C146.75 141.902 146.87 141.182 147.11 140.302C148.23 136.622 149.05 133.482 149.57 130.882C150.13 128.242 150.41 125.082 150.41 121.402Z"
                                    fill="white"/>
                                <path
                                    d="M142.637 100.583C142.637 99.9032 142.697 99.4432 142.817 99.2032C142.937 98.9232 143.237 98.7832 143.717 98.7832C144.197 98.7832 144.717 99.2232 145.277 100.103C145.877 100.943 146.177 101.923 146.177 103.043C146.177 104.163 145.717 107.203 144.797 112.163C143.917 117.123 142.397 123.783 140.237 132.143C138.117 140.503 136.737 144.683 136.097 144.683C135.657 144.683 135.217 144.443 134.777 143.963C134.337 143.443 134.117 142.903 134.117 142.343C134.117 141.743 134.397 140.183 134.957 137.663C133.237 139.703 131.377 141.383 129.377 142.703C127.377 144.023 125.457 144.683 123.617 144.683C121.777 144.683 120.197 143.963 118.877 142.523C117.597 141.043 116.957 139.423 116.957 137.663C116.957 135.863 117.397 133.703 118.277 131.183C119.197 128.663 120.357 126.243 121.757 123.923C123.197 121.603 124.937 119.643 126.977 118.043C129.017 116.403 131.057 115.583 133.097 115.583C136.177 115.583 138.177 117.623 139.097 121.703C141.097 113.223 142.277 106.183 142.637 100.583ZM133.337 119.123C131.537 119.123 129.617 120.183 127.577 122.303C125.537 124.383 123.857 126.923 122.537 129.923C121.217 132.883 120.557 135.623 120.557 138.143C120.557 139.063 120.937 139.843 121.697 140.483C122.457 141.123 123.277 141.443 124.157 141.443C125.997 141.443 128.337 140.183 131.177 137.663C134.377 134.783 136.477 131.603 137.477 128.123C137.477 125.563 137.117 123.423 136.397 121.703C135.677 119.983 134.657 119.123 133.337 119.123Z"
                                    fill="white"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div ref={sphere} className={styles.sphereWrapper}>
                    <div className={`${styles.sphere} ${dragStatus === 'pressed' ? styles.isActive : ''}`}></div>
                </div>
            </section>
            <Ticker words={['accessibility', 'responsiveness', 'interactive', 'performance']}></Ticker>
        </>
    )
}