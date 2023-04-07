import React from "react";
import './match.css';
import Bracket from '../../assets/Bracket.png';

const Match = () => {
    return (
        <section className="match section" id="match">
            <h2 className="section__title">Matches</h2>
            <span className="section__subtitle">Playoff</span>

            {/*<div className="match__container container grid">
                <div className="match__content 1">
                    <h3 className="match__title">Round 1</h3>
                    <h3 className="match__title">(20 - 22 March)</h3>

                    <div className="match__box">
                        <div className="match__group">
                            <div className="match__data">
                                <div>
                                    GROUP A
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>kafiti vs tanzania-student</li>
                                        <li>klaus_gudy vs hopertz</li>
                                    </h3>
                                    GROUP B
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>no_mane vs dinokapon26</li>
                                        <li>onesmo vs kazremy</li>
                                    </h3>
                                    GROUP C
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>bigfivewin05 vs arnie_n</li>
                                        <li>andre_beatz vs innosaint</li>
                                    </h3>
                                    GROUP D
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>alphazzz3r0 vs kdaxh</li>
                                        <li>hermamtm vs musir6363</li>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="match__content 2">
                    <h3 className="match__title">Round 2</h3>
                    <h3 className="match__title">(23 - 25 March)</h3>

                    <div className="match__box">
                        <div className="match__group">
                            <div className="match__data">
                                <div>
                                    GROUP A
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>klaus_gudy vs kafiti</li>
                                        <li>hopertz vs tanzania-student</li>
                                    </h3>
                                    GROUP B
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>kazremy vs dinokapon26</li>
                                        <li>onesmo vs no_mane</li>
                                    </h3>
                                    GROUP C
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>innosaint vs bigfivewin05</li>
                                        <li>arnie_n vs andre_beatz</li>
                                    </h3>
                                    GROUP D
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>hermamtm vs kdaxh</li>
                                        <li>musir6363 vs alphazzz3r0</li>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="match__content 3">
                    <h3 className="match__title">Round 3</h3>
                    <h3 className="match__title">(26 - 28 March)</h3>

                    <div className="match__box">
                        <div className="match__group">
                            <div className="match__data">
                                <div>
                                    GROUP A
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>kafiti vs hopertz</li>
                                        <li>tanzania-student vs klaus_gudy</li>
                                    </h3>
                                    GROUP B
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>dinokapon26 vs onesmo</li>
                                        <li>kazremy vs no_mane</li>
                                    </h3>
                                    GROUP C
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>andre_beatz vs bigfivewin05</li>
                                        <li>innosaint vs arnie_n</li>
                                    </h3>
                                    GROUP D
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>kdaxh vs musir6363</li>
                                        <li>alphazzz3r0 vs hermamtm</li>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="match__content 4">
                    <h3 className="match__title">Round 4</h3>
                    <h3 className="match__title">(29 - 31 March)</h3>

                    <div className="match__box">
                        <div className="match__group">
                            <div className="match__data">
                                <div>
                                    GROUP A
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>hopertz vs kafiti</li>
                                        <li>klaus_gudy vs tanzania-student</li>
                                    </h3>
                                    GROUP B
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>onesmo vs dinokapon26</li>
                                        <li>no_mane vs kazremy</li>
                                    </h3>
                                    GROUP C
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>bigfivewin05 vs andre_beatz</li>
                                        <li>arnie_n vs innosaint</li>
                                    </h3>
                                    GROUP D
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>musir6363 vs kdaxh</li>
                                        <li>hermamtm vs alphazzz3r0</li>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="match__content 5">
                    <h3 className="match__title">Round 5</h3>
                    <h3 className="match__title">(01 - 03 April)</h3>

                    <div className="match__box">
                        <div className="match__group">
                            <div className="match__data">
                                <div>
                                    GROUP A
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>kafiti vs klaus_gudy</li>
                                        <li>tanzania-student vs hopertz</li>
                                    </h3>
                                    GROUP B
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>dinokapon26 vs kazremy</li>
                                        <li>no_mane vs onesmo</li>
                                    </h3>
                                    GROUP C
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>bigfivewin05 vs innosaint</li>
                                        <li>andre_beatz vs arnie_n</li>
                                    </h3>
                                    GROUP D
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>kdaxh vs hermamtm</li>
                                        <li>alphazzz3r0 vs musir6363</li>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="match__content 6">
                    <h3 className="match__title">Round 6</h3>
                    <h3 className="match__title">(04 - 06 April)</h3>

                    <div className="match__box">
                        <div className="match__group">
                            <div className="match__data">
                                <div>
                                    GROUP A
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>tanzania-student vs kafiti</li>
                                        <li>hopertz vs klaus_gudy</li>
                                    </h3>
                                    GROUP B
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>dinokapon26 vs no_mane</li>
                                        <li>kazremy vs onesmo</li>
                                    </h3>
                                    GROUP C
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>arnie_n vs bigfivewin05</li>
                                        <li>innosaint vs andre_beatz</li>
                                    </h3>
                                    GROUP D
                                    <h3 className="match__name ⓌⒹⓁ">
                                        <li>kdaxh vs alphazzz3r0</li>
                                        <li>musir6363 vs hermamtm</li>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div></div>*/}
            
            <img src={Bracket} className="br" />
        </section>
    );
};

export default Match;