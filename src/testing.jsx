/* eslint-disable react-native/no-inline-styles */
import {Alert, Pressable, Image, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import SafePageContainer from '../../components/containers/SafePageContainer';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utilities/screenUtils';
import Icon from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../themes/Colors';
import CustomBox from '../../components/containers/CustomBox';
import HeartIcon from '../../assets/svg/HeartIcon';
import CustomText from '../../components/CustomText';
import {SIZES} from '../../themes/SIZES';
import Custombtn from '../../components/buttons/Custombtn';
import FlaskIcon from '../../assets/svg/FlaskIcon';
import ClockIcon from '../../assets/svg/ClockIcon';
import {apiGet, apiPost} from '../../api-services/apiService';
import paths from '../../api-services/endpoints';
import Test from './Test';
import ResultBox from './ResultBox';
import {
  popErrorAlert,
  popSuccessAlert,
  popWarningAlert,
} from '../../utilities/alertFunctions';
import {Screens} from '../../routes/ScreenNames';
import Tts from 'react-native-tts';
import CountDownTimer from 'react-native-countdown-timer-hooks';
import SpeechRecognition from './SpeechRecognition';
import {useDispatch, useSelector} from 'react-redux';
import {
  calculatePercentage,
  convertSymbolToWords,
  parseExpression,
} from '../../utilities/helperFuncs';
import BackIcon from '../../assets/svg/BackIcon';
import {getProfile} from '../dashboard';

var Sound = require('react-native-sound');

Sound.setCategory('Playback');

var success = new Sound('success.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // loaded successfully
  console.log(
    'duration in seconds: ' +
      success.getDuration() +
      'number of channels: ' +
      success.getNumberOfChannels(),
  );
});
var failed = new Sound('failed.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // loaded successfully
  console.log(
    'duration in seconds: ' +
      failed.getDuration() +
      'number of channels: ' +
      failed.getNumberOfChannels(),
  );

  // Play the sound with an onEnd callback
});

Tts.setDefaultLanguage('en-US'); // set default language to US English
Tts.setDefaultVoice('com.apple.ttsbundle.Samantha-compact'); // set default voice to Samantha

const QuestionScreen = ({navigation, route}) => {
  const {level, stage, mode, name} = route.params;
  console.log(route.params);
  const [test, setTest] = useState(Array(10));
  const [results, setResults] = useState(Array(test?.length).fill(null));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [timer, setTimer] = useState(10);
  const [testOver, setTestOver] = useState(false);
  // For keeping a track on the Timer
  const [timerEnd, setTimerEnd] = useState(false);
  // Timer References
  const refTimer = useRef();
  const [speakStatus, setSpeakStatus] = useState(0); //0 - stale, 1 - speaking, 2 - spoken, 3 - correct
  const [answerCorrect, setAnswerCorrect] = useState(0); //0 - null, 1 - correct, 2 - wrong,
  const [voices, setVoices] = useState([]);
  const [ttsStatus, setTtsStatus] = useState('initiliazing');
  const [speechRate, setSpeechRate] = useState(0.5);
  const [speechPitch, setSpeechPitch] = useState(1);

  useEffect(() => {
    Tts.addEventListener('tts-start', _event => setTtsStatus('started'));
    Tts.addEventListener('tts-finish', _event => setTtsStatus('finished'));
    Tts.addEventListener('tts-cancel', _event => setTtsStatus('cancelled'));
    Tts.setDefaultRate(speechRate);
    Tts.setDefaultPitch(speechPitch);
    Tts.getInitStatus().then(initTts);
    Tts.setDefaultLanguage('en-US'); // set default language to US English
    Tts.setDefaultVoice('com.apple.ttsbundle.Samantha-compact'); // set default voice to Samantha

    return () => {
      Tts.removeEventListener('tts-start', _event => setTtsStatus('started'));
      Tts.removeEventListener('tts-finish', _event => setTtsStatus('finished'));
      Tts.removeEventListener('tts-cancel', _event =>
        setTtsStatus('cancelled'),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const initTts = async () => {
    const voices = await Tts.voices();
    if (voices && voices.length > 0) {
      try {
        await Tts.setDefaultLanguage('en-US');
      } catch (err) {
        console.log('setDefaultLanguage error ', err);
      }
      await Tts.setDefaultVoice('com.apple.ttsbundle.Samantha-compact');
      setTtsStatus('initialized');
    } else {
      setTtsStatus('initialized');
    }
  };
  const readText = async text => {
    Tts.stop();
    Tts.speak(convertSymbolToWords(text));
  };
  useEffect(() => {
    if (!testOver) {
      readText(currentQuestion?.question);
    } else {
      readText('');
    }
  }, [test, questionIndex, testOver, currentQuestion?.question]);

  const getHealth = async () => {
    await apiGet(paths.health).then(res => console.log('health ressss', res));
  };

  const timerCallbackFunc = timerFlag => {
    // Setting timer flag to finished
    setTimerEnd(timerFlag);
    onTimeUp();
    console.log(timerFlag, 'TimerFlag');
    // setTestOver(true);
    // handleSubmit();
  };
  // const restartTimer = () => {
  //   setTimerEnd(false);
  //   refTimer.current.resetTimer();
  // };
  // const onPressSpeech = text => {
  //   Tts.stop();
  //   Tts.speak(text);
  // };
  useEffect(() => {
    // getHealth();
    readText("Let's get started");
    const setQues = setTimeout(() => {
      apiGet(paths.generateQuestions(level, stage))
        .then(res => {
          setTimer(res?.data?.data?.seconds_per_question);
          console.log('quest ressss', res?.data?.data?.test);
          setTest(res?.data?.data?.test);
          setSessionId(res?.data?.data?.session_id);
        })
        .catch(err => {
          console.log('err', err);
          popErrorAlert(
            err.message ||
              'Something went wrong please try again in a few minutes',
            'Connection Error',
          );
          navigation.goBack();
        });
    }, 1200);

    return () => clearTimeout(setQues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setResults(Array(test?.length).fill(null));
  }, [test?.length]);
  const currentQuestion = test[questionIndex];

  if (questionIndex >= test.length) {
    setTestOver(true);
  }
  const onTimeUp = () => {
    // popErrorAlert('Time is Up', 'Next question');
    setUserAnswer('');
    handleSubmit();
  };

  const nextQuestionIndex = useMemo(() => questionIndex + 1, [questionIndex]);
  const handleNextQuestion = useCallback(() => {
    if (!testOver) {
      setQuestionIndex(() => nextQuestionIndex);
    }
    refTimer.current.resetTimer();
  }, [nextQuestionIndex, testOver]);

  console.log('questttt', questionIndex);
  const handleSubmit = useCallback(() => {
    const isCorrect = parseFloat(userAnswer) === currentQuestion?.answer;
    setAnswerCorrect(0);
    const newResults = [...results];
    newResults[questionIndex] = isCorrect ? 'correct' : 'fail';
    setResults(() => newResults);

    if (isCorrect) {
      setAnswerCorrect(1);
    }
    if (!isCorrect) {
      setAnswerCorrect(2);
    }
    if (!isCorrect && mode === 'consecutive') {
      setTestOver(true);
    }
    if (questionIndex === test.length - 1) {
      console.log('lastQue');
      console.log('results from que page', results);
      setTestOver(true);
      return;
    }
    // onTimeUp();
    // timerCallbackFunc();
    if (!testOver) {
      handleNextQuestion();
    }

    setTimeout(() => {
      setAnswerCorrect(0);
    }, 1500);
    // setTimerEnd(false);
    // restartTimer();
    // setUserAnswer('');
  }, [
    currentQuestion?.answer,
    handleNextQuestion,
    questionIndex,
    results,
    stage,
    test.length,
    userAnswer,
    testOver,
  ]);

  console.log('test over', testOver);
  const viewResults = () => {
    navigation.navigate(Screens.TestResults, {results: results});
  };

  console.log(test);
  const countCorrect = strings => {
    return strings.reduce((count, str) => {
      return str === 'correct' ? count + 1 : count;
    }, 0);
  };

  const onSubmit = () => {
    const answerArray = {
      session_id: sessionId,
      result: test.map((question, idx) => ({
        question: question.question,
        answer: question.answer,
        id: idx + 1,
        correct: results[idx] === 'correct',
      })),
    };

    apiPost(paths.submitAnswers, answerArray).then(res => {
      console.log('res', res);
    });
  };

  useEffect(() => {
    if (testOver) {
      Tts.stop();
      setTimerEnd(true);
      if (testOver) {
        readText(
          calculatePercentage(results) < 70
            ? 'Oh, you scored below the pass mark, please try the test again'
            : 'Congratulations!!... Good job',
        );
        if (calculatePercentage(results) < 70) {
          failed.play(res => {
            if (res) {
              console.log('successfully finished playing');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        } else {
          success.play(res => {
            if (res) {
              console.log('successfully finished playing');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        }
      }
      onSubmit();
    }
  }, [testOver]);

  return (
    <SafePageContainer
      leftIcon={
        // <Icon name="caretleft" size={verticalScale(24)} color={COLORS.white} />
        <BackIcon />
      }
      rightIcon={<LivesCount />}
      leftIconAction={() => {
        navigation.goBack();
      }}
      headerText={name}
      // headerText={Level ${level}}
      rightIconAction={() => console.warn('Lives clicked')}
      scroll>
      {!test[0] && timer ? (
        <CustomBox styles={{flex: 1}} justify="center" align="center">
          <ActivityIndicator color={COLORS.darkblue} />
        </CustomBox>
      ) : (
        <>
          <Custombtn
            bg={COLORS.darkblue}
            shadow={COLORS.blueShadow}
            h={verticalScale(72)}
            ph={0}>
            <CustomBox flexRow justify="space-between" align="center">
              <CustomBox
                flexRow
                mr={horizontalScale(21)}
                justify="space-between"
                align="center">
                <CustomBox mr={horizontalScale(9)}>
                  <FlaskIcon />
                </CustomBox>
                <CustomText color={COLORS.white} weight={SIZES.fontWeight.bold}>
                  {countCorrect(results)} &#8725; {test?.length}
                </CustomText>
              </CustomBox>
              <CustomBox
                h={verticalScale(48)}
                bg={COLORS.blueShadow}
                w={horizontalScale(1)}
              />
              <CustomBox flexRow mh={horizontalScale(10)}>
                {/* <CountIcon />
                 */}

                <ResultBox results={Object.values(results)} questions={test} />
              </CustomBox>
              <CustomBox
                h={verticalScale(48)}
                bg={COLORS.blueShadow}
                w={horizontalScale(1)}
              />
              <CustomBox
                flexRow
                ml={horizontalScale(21)}
                justify="space-between"
                align="center">
                <CustomBox mr={horizontalScale(9)}>
                  <ClockIcon />
                </CustomBox>

                {testOver ? (
                  <CountDownTimer
                    ref={refTimer}
                    timestamp={0}
                    timerCallback={() => {
                      handleSubmit();
                      timerCallbackFunc();
                    }}
                    containerStyle={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    textStyle={{
                      fontSize: SIZES.body1,
                      color: '#FFFFFF',
                      letterSpacing: 0.9,
                      fontWeight: SIZES.fontWeight.bold,
                    }}
                    onTimeElapsed={() => {
                      setTimerEnd(true);
                      handleSubmit();
                    }}
                  />
                ) : (
                  <CountDownTimer
                    ref={refTimer}
                    timestamp={timer}
                    timerCallback={() => {
                      handleSubmit();
                      timerCallbackFunc();
                    }}
                    containerStyle={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    textStyle={{
                      fontSize: SIZES.body1,
                      color: '#FFFFFF',
                      letterSpacing: 0.9,
                      fontWeight: SIZES.fontWeight.bold,
                    }}
                    onTimeElapsed={() => {
                      setTimerEnd(true);
                      handleSubmit();
                    }}
                  />
                )}
              </CustomBox>
            </CustomBox>
          </Custombtn>
          <CustomBox align="center" mv={verticalScale(90)}>
            {/* <CustomText
          fontSize={SIZES.largeText}
          color={COLORS.white}
          weight={SIZES.fontWeight.bold}>
          62 x 4 (8) &#xF7; 15
        </CustomText> */}
            <Test
              currentQuestion={currentQuestion}
              testOver={testOver}
              viewResults={viewResults}
              results={results}
              test={test}
              onSubmit={onSubmit}
              readText={readText}
            />
          </CustomBox>
          {!testOver && (
            <SpeechRecognition
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              handleSubmit={handleSubmit}
              testOver={testOver}
              stopTTS={Tts.stop}
            />
          )}
          {!testOver && answerCorrect === 1 && (
            <CustomBox align="center" justify="center">
              <Image
                source={{
                  uri: 'https://media.giphy.com/media/Xa3yTQs26BHFa52jIm/giphy.gif',
                }}
                style={{
                  width: 100,
                  height: 100,
                  marginBottom: verticalScale(32),
                }}
                resizeMode={'cover'}
              />
            </CustomBox>
          )}
          {!testOver && answerCorrect === 2 && (
            <CustomBox align="center" justify="center">
              <Image
                source={{
                  uri: 'https://media.giphy.com/media/d6DneiOmBAW4kDpeR3/giphy.gif',
                }}
                style={{
                  width: 100,
                  height: 100,
                  marginBottom: verticalScale(32),
                }}
                resizeMode={'cover'}
              />
            </CustomBox>
          )}
          {!testOver && answerCorrect === 0 && (
            <Custombtn
              bg={COLORS.purple}
              shadow={COLORS.purpleShadow}
              text={'Skip'}
              textColor={COLORS.white}
              onPress={handleSubmit}
            />
          )}
        </>
      )}
    </SafePageContainer>
  );
};

export default QuestionScreen;






// jsx
// const handleAnswerClick = async (answer) => {
//   // ...
//   setTimeout(() => {
//     await handleNextQuestion();
//   }, 2000);
// };

// const handleNextQuestion = async () => {
//   // ...
//   if (currentQuestionIndex < questions.length - 1) {
//     setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//   } else {
//     await finalizeGame();
//   }
// };

// const finalizeGame = async () => {
//   await new Promise((resolve) => {
//     setTimeout(resolve, 1000); // Wait for 1 second to ensure statuses is updated
//   });
//   const finalScore = score;
//   const finalStatuses = statuses;
//   console.log("All questions answered. Final Score:", finalScore, finalStatuses);
//   await handleUpdateLeaderboardScore(msisdn, finalScore);
//   setTimeout(() => {
//     navigate("/result-page", {
//       state: {
//         score: finalScore,
//         totalQuestions: questions.length,
//         statuses: finalStatuses,
//       },
//     });
//   }, 2000);
// };




// const [iframeSrc, setIframeSrc] = useState("");
// const [currentGame, setCurrentGame] = useState(null);

// // URLs for different games
// const gameUrls = {
//   XwingFighter: "/x-wing-fighter/index.html",
//   SkateRush: "/skate-rush/index.html",
//   StarWars: "/star-wars-rogue/index.html",
//   TempleRun: "/temple-run-2/index.html",
// };

// // Function to handle "Play" for different games
// const handlePlay = (gameName, msisdn) => {
//   let storedData = null;
//   let bestScore = 0;

//   switch (gameName) {
//     case "XwingFighter":
//       storedData = localStorage.getItem("com.disney.fighter.game_11.save");
//       bestScore = storedData ? JSON.parse(storedData).bestScore : 0;
//       break;
//     case "SkateRush":
//       storedData = localStorage.getItem("skaterushv4");
//       bestScore = storedData ? JSON.parse(storedData).bestScore : 0;
//       break;
//     case "StarWars":
//       storedData = localStorage.getItem("sw_boots_1.0");
//       bestScore = storedData ? JSON.parse(storedData).highScore : 0;
//       break;
//     case "TempleRun":
//       storedData = localStorage.getItem("TR2_GAME_STATE");
//       bestScore = storedData ? JSON.parse(storedData).score : 0;
//       break;
//     default:
//       break;
//   }

//   console.log(`Stored score for ${gameName}:`, bestScore);
//   setIframeSrc(gameUrls[gameName]);
//   setCurrentGame(gameName);
// };

// // Function to handle "Back to App" for different games
// const handleBackToApp = async (gameName, msisdn) => {
//   setIframeSrc(""); // Reset iframe
//   let storedData = null;
//   let gameScore = 0;

//   switch (gameName) {
//     case "XwingFighter":
//       storedData = localStorage.getItem("com.disney.fighter.game_11.save");
//       gameScore = storedData ? JSON.parse(storedData).bestScore : 0;
//       break;
//     case "SkateRush":
//       storedData = localStorage.getItem("skaterushv4");
//       gameScore = storedData ? JSON.parse(storedData).bestScore : 0;
//       break;
//     case "StarWars":
//       storedData = localStorage.getItem("sw_boots_1.0");
//       gameScore = storedData ? JSON.parse(storedData).highScore : 0;
//       break;
//     case "TempleRun":
//       storedData = localStorage.getItem("TR2_GAME_STATE");
//       gameScore = storedData ? JSON.parse(storedData).score : 0;
//       break;
//     default:
//       break;
//   }

//   console.log(`Stored score outside for ${gameName}:`, gameScore);

//   // Call the leaderboard update API with the retrieved score
//   await handleUpdateLeaderboardScore(msisdn, gameScore);
//   setCurrentGame(null); // Reset the game state
// };

// // JSX for rendering iframe and buttons
// return (
//   <div>
//     {iframeSrc ? (
//       <>
//         {/* Iframe for the game */}
//         <iframe src={iframeSrc} width="100%" height="600px" />

//         {/* Conditional Back Button based on currentGame */}
//         {currentGame === "XwingFighter" && (
//           <button onClick={() => handleBackToApp("XwingFighter", msisdn)}>
//             Back to App (Xwing Fighter)
//           </button>
//         )}
//         {currentGame === "SkateRush" && (
//           <button onClick={() => handleBackToApp("SkateRush", msisdn)}>
//             Back to App (Skate Rush)
//           </button>
//         )}
//         {currentGame === "StarWars" && (
//           <button onClick={() => handleBackToApp("StarWars", msisdn)}>
//             Back to App (Star Wars)
//           </button>
//         )}
//         {currentGame === "TempleRun" && (
//           <button onClick={() => handleBackToApp("TempleRun", msisdn)}>
//             Back to App (Temple Run)
//           </button>
//         )}
//       </>
//     ) : (
//       <>
//         {/* Game play buttons */}
//         <button onClick={() => handlePlay("XwingFighter", msisdn)}>Play X-Wing Fighter</button>
//         <button onClick={() => handlePlay("SkateRush", msisdn)}>Play Skate Rush</button>
//         <button onClick={() => handlePlay("StarWars", msisdn)}>Play Star Wars</button>
//         <button onClick={() => handlePlay("TempleRun", msisdn)}>Play Temple Run</button>
//       </>
//     )}
//   </div>
// );



// import React, { useState, useEffect, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import CarouselSection from "../Components/CarouselSection";
// import Arrow from "../assets/Icons/Arrow.png";
// import Action from "../assets/Icons/action.png";
// import Fantasy from "../assets/Icons/fantasy.png";
// import Racing from "../assets/Icons/racing.png";
// import StarYs from "../assets/Icons/Star-ys.png";
// import StarWs from "../assets/Icons/Star-ws.png";
// import SkateRush from "../assets/Images/rush.jpeg";
// import XWinger from "../assets/Images/x-winger.png";
// import StarWars from "../assets/Images/ground.jpeg";
// import TempleQuest from "../assets/Images/quest.jpeg";
// import BigCash from "../assets/Images/big-cash.jpeg";
// import Home from "../assets/Icons/home.png";
// import Leaderboard from "../assets/Icons/leaderboard.png";
// import Profile from "../assets/Icons/profile.png";
// import FooterNav from "../assets/Images/nav-container.png";
// import AvatarProfile from "../assets/Images/avatar-prof.png";
// import Coins from "../assets/Images/coins.png";
// import PlusIcon from "../assets/Icons/plus-icon.png";
// import Avatar1 from "../assets/Icons/avatar1.png";
// import Avatar2 from "../assets/Icons/avatar2.png";
// import Avatar3 from "../assets/Icons/avatar3.png";
// import Avatar4 from "../assets/Icons/avatar4.png";
// import Avatar5 from "../assets/Icons/avatar5.png";
// import AuthContext from "../Context/AuthContext";
// import GameContext from "../Context/GameContext";
// import UserContext from "../Context/UserContext";
// import BigCashGame from "../Components/BigCashGame";
// import StarRatings from "../Components/StarRatings";
// import { LeaderboardContext } from "../Context/LeaderboardContext";

// const HomePage = () => {
//   const avatars = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5];
//   const [selectedAvatar, setSelectedAvatar] = useState(null);
//   const [showAvatarSelector, setShowAvatarSelector] = useState(false);
//   const [currentAvatar, setCurrentAvatar] = useState(AvatarProfile);
//   const [scrollDirection, setScrollDirection] = useState("null");
//   const [lastScrollTop, setLastScrollTop] = useState(0);
//   const { auth } = useContext(AuthContext);
//   const { handleUpdateSubscriberProfile, fetchProfile, userProfile, msisdn } =
//     useContext(UserContext);
//   const { games, loading } = useContext(GameContext);
//   const [categories, setCategories] = useState([]);
//   const [nickname, setNickname] = useState("Racer001");
//   const { handleUpdateLeaderboardScore } = useContext(LeaderboardContext);
//   const { leaderboard, fetchLeaderboardStanding } =
//     useContext(LeaderboardContext);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();
//   const [iframeSrc, setIframeSrc] = useState("");

//   useEffect(() => {
//     if (games && games.length > 0) {
//       const uniqueCategories = [
//         ...new Set(games.map((game) => game.category[0])),
//       ];

//       setCategories(uniqueCategories);
//     }
//   }, [games]);

//   const truncateTitle = (title) => {
//     const maxLength = 10;
//     if (title.length > maxLength) {
//       return title.substring(0, maxLength) + "...";
//     }
//     return title;
//   };

//   useEffect(() => {
//     let lastScrollTop = 0;

//     const handleScroll = () => {
//       const scrollTop = window.scrollY || document.documentElement.scrollTop;

//       if (scrollTop > lastScrollTop) {
//         setScrollDirection("down");
//       } else {
//         setScrollDirection("up");
//       }
//       setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
//     };
//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [lastScrollTop]);

//   const navStyle = {
//     position: "fixed",
//     bottom: scrollDirection === "down" ? "0px" : "0px",
//     left: "50%",
//     transform: "translateX(-50%)",
//     transition: "bottom 0.5s ease",
//   };

//   useEffect(() => {
//     const storedAvatar = localStorage.getItem("selectedAvatar");
//     if (storedAvatar) {
//       setSelectedAvatar(storedAvatar);
//       setCurrentAvatar(storedAvatar);
//     }
//   }, []);
//   const storedMsisdn = localStorage.getItem("cli");

//   const handleAvatarClick = () => {
//     setShowAvatarSelector(!showAvatarSelector);
//   };

//   const handleAvatarSelect = (avatarId) => {
//     setSelectedAvatar(avatarId);
//   };

//   const handleSave = async () => {
//     try {
//       if (!selectedAvatar) return;
//       const avatarId = avatars.indexOf(selectedAvatar) + 1;

//       const msisdn = userProfile?.msisdn;
//       if (!msisdn) {
//         setError("MSISDN is required");
//         console.log("MSISDN is required");
//         return;
//       }
//       const nickname = msisdn;
//       console.log("avatar saved", avatarId);

//       console.log("avatar saved in storage", localStorage);
//       localStorage.setItem("selectedAvatar", selectedAvatar);

//       await handleUpdateSubscriberProfile(msisdn, nickname, avatarId);

//       setCurrentAvatar(selectedAvatar);

//       setShowAvatarSelector(false);
//     } catch (error) {
//       console.error("Error saving avatar:", error);
//     }
//   };

 

//   const XwingFighterUrl = "/x-wing-fighter/index.html";

//   const handlePlay = (XwingFighterUrl, msisdn) => {
//     const storedData = localStorage.getItem("com.disney.fighter.game_11.save");
//     console.log("Stored score for stored:", storedData);

//     const parsedData = storedData ? JSON.parse(storedData) : null;

//     const bestScore = parsedData ? parsedData.bestScore : 0;

//     console.log("Stored score for bestScore:", bestScore);

//     setIframeSrc(XwingFighterUrl);
//   };

//   const handleBackToApp = async () => {
//     setIframeSrc("");
//     const storedData = localStorage.getItem("com.disney.fighter.game_11.save");

//     const parsedData = storedData ? JSON.parse(storedData) : null;

//     const bestScore = parsedData ? parsedData.bestScore : 0;

//     console.log("Stored score outside for bestScore:", bestScore);
//     const gameScore = bestScore;

//     await handleUpdateLeaderboardScore(msisdn, gameScore);
//   };

//   const SkateRushUrl = "/skate-rush/index.html";

//   const handleSkatePlay = (SkateRushUrl, msisdn) => {

//     const storedData = localStorage.getItem("skaterushv4");
//     console.log("Stored score for stored:", storedData);

//     const parsedData = storedData ? JSON.parse(storedData) : null;

//     const bestScore = parsedData ? parsedData.bestScore : 0;

//     console.log("Stored score for bestScore:", bestScore);

//     setIframeSrc(SkateRushUrl);
//   };

//   const StarWarsUrl = "/star-wars-rogue/index.html";

//   const handleStarWarsPlay = (StarWarsUrl, msisdn) => {

//     const storedData = localStorage.getItem("sw_boots_1.0");
//     console.log("Stored score for stored:", storedData);

//     const parsedData = storedData ? JSON.parse(storedData) : null;

//     const highScore = parsedData ? parsedData.highScore : 0;

//     console.log("Stored score for highScore:", highScore);

//     setIframeSrc(StarWarsUrl);
//   };


//   const TempleRunUrl = "/temple-run-2/index.html";

//   const handleTemplePlay = (TempleRunUrl, msisdn) => {

//     const storedData = localStorage.getItem("TR2_GAME_STATE");
//     console.log("Stored score for stored:", storedData);

//     const parsedData = storedData ? JSON.parse(storedData) : null;

//     const score = parsedData ? parsedData.score : 0;

//     console.log("Stored score for highScore:", score);

//     setIframeSrc(TempleRunUrl);
//   };

//   const handleSwToApp = async () => {
//     setIframeSrc("");
//     const storedData = localStorage.getItem("com.disney.fighter.game_11.save");

//     const parsedData = storedData ? JSON.parse(storedData) : null;

//     const bestScore = parsedData ? parsedData.highScore : 0;

//     console.log("Stored score outside for bestScore:", highScore);
//     const gameScore = bestScore;

//     await handleUpdateLeaderboardScore(msisdn, gameScore);
//   };

 

//   console.log(msisdn);

//   return (
//     <>
//       <div className="relative ">
//         <div
//           className={`flex flex-col min-h-screen  h-[1240px] bg-darrk-gradient  ${
//             showAvatarSelector ? " blur-[3px]" : ""
//           }`}
//         >
//           <div className="bg-[#E2EEF60D] mt-[17px]">
//             <div className="bg-nav-gradient rounded-[26px] text-white flex justify-center items-center w-[222px] h-[49px]  mt-[21px] mx-auto">
//               <div className="flex justify-between items-center w-[242px] h-[49px]">
//                 <div className="flex items-center  space-x-10  relative">
//                   <div
//                     className="w-[50px] h-[50px]  flex items-center justify-center cursor-pointer"
//                     onClick={handleAvatarClick}
//                   >
//                     <img
//                       src={currentAvatar || AvatarProfile}
//                       alt="Profile Avatar"
//                       className="-ml-[8px] -mb-[6px]"
//                     />
//                   </div>
//                   <div className="flex items-center justify-center gap-[10px]  ">
//                     {/* <div className="flex items-center justify-center">
//                       <img src={Coins} alt="coin" />
//                       <p className="font-mtn-brighter-medium font-medium text-[12px] text-center leading-[15.6px] text-[#FFFFFF]">
//                         R10k
//                       </p>
//                     </div> */}

//                     <Link
//                       to="/terms-and-conditions"
//                       className="border border-[#FFCB05] rounded-[26px] w-[51px] h-[27px] bg-[#7F806266] flex justify-center items-center mt-[12px] mb-[10px] "
//                     >
//                       <p className="font-mtn-brighter-medium font-medium text-[12px] leading-[15.6px] text-center text-[#FFCB05]">
//                         T&C's
//                       </p>
//                     </Link>
//                     <Link
//                       to="/faq"
//                       className="border border-[#FFCB05]   rounded-[26px] w-[51px] h-[27px]  flex items-center  justify-center gap-[6px]   py-[5px] px-[20px]  "
//                     >
//                       <p className="font-mtn-brighter-medium font-medium text-[12px] leading-[15.6px] text-center text-[#FFCB05]">
//                         {" "}
//                         FAQ's
//                       </p>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-background w-[140px] h-[28px] rounded-b-[26px] flex items-center justify-center mx-auto shadow-box-shadow">
//               <p className="font-mtn-brighter-medium font-medium text-[10px] leading-[13px] text-center text-[#FFFFFF]">
//                 @{msisdn}
//               </p>
//             </div>
//             <div className="flex flex-col items-center flex-grow mt-[20px]">
//               <p className="text-white mb-[17px] font-mtn-brighter-xtra-bold font-extrabold text-[24px] leading-[31.2px] text-center">
//                 Play Now
//               </p>
//               {loading ? <p>Loading games...</p> : <CarouselSection />}
//             </div>
//           </div>

//           <section className="mt-[36px] w-full max-w-4xl lg:mx-auto">
//             <h2 className="font-mtn-brighter-xtra-bold font-extrabold text-[24px] leading-[31.2px] text-center text-[#FFFFFF]">
//               All Games
//             </h2>
//             <div className="space-x-[33px] mt-[17px] flex justify-center items-center mb-[20px]">
//               {/* {categories.map((category, index) => (
//                 <button
//                   key={index}
//                   className="flex items-center justify-center text-white rounded-[26px] border border-[#D7E7F066] bg-[#EDF0F233] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] gap-[6px] text-center px-[9px] py-[5px]"
//                 >
//                   {category === "Action" && <img src={Action} alt="action" />}
//                   {category === "Adventure" && (
//                     <img src={Fantasy} alt="fantasy" />
//                   )}
//                   {category === "Racing" && <img src={Racing} alt="racing" />}
//                   {category}
//                 </button>
//               ))} */}
//             </div>

//             <div className="flex items-center justify-center">
//               <div className="grid grid-cols-2 gap-[35px] mb-4">
//                 {/* {games.map((game, index) => ( */}

//                 {/* {games && */}
//                 {/* games.length > 0 && */}
//                 {/* games.map((game) => ( */}
//                 <div
//                   // key={game.gameId}
//                   className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]"
//                 >
//                   <img
//                     src={SkateRush}
//                     alt="rush"
//                     className="mb-[6px] -mt-[50px] w-[60px] h-[60px] rounded-[12px] object-cover"
//                   />
//                   {/* <img
//                         src={
//                           game.base64
//                             ? `data:image/png;base64,${game.base64}`
//                             : game.title &&
//                               game.title.trim() === "X-Wing Fighter"
//                             ? XWinger
//                             : ""
//                         }
//                         alt={game.title || "game-image"}
//                         className="mb-[6px] -mt-[50px] w-[60px] h-[60px] rounded-[12px] object-cover"
//                       /> */}

//                   <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
//                     {/* {truncateTitle(game.title.toUpperCase())} */}
//                     SKATE RUSH
//                   </p>
//                   <div className="flex items-center justify-center mt-[9.8px]">
//                     {/* <StarRatings /> */}
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                   </div>

//                   <Link to="#">
//                     <button
//                       onClick={() => handleSkatePlay(SkateRushUrl, msisdn)}
//                       className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]"
//                     >
//                       Play
//                     </button>
//                   </Link>
//                 </div>

//                 <div className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]">
//                   <img
//                     src={StarWars}
//                     alt="ground"
//                     className="mb-[6px] -mt-[50px] w-[60px] h-[60px] rounded-[12px] object-cover"
//                   />

//                   <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
//                     STAR WARS
//                   </p>
//                   <div className="flex items-center justify-center mt-[9.8px]">
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                   </div>

//                   <Link to="#">
//                     <button
//                       onClick={() => handleStarWarsPlay(StarWarsUrl, msisdn)}
//                       className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]"
//                     >
//                       Play
//                     </button>
//                   </Link>
//                 </div>

//                 <div className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]">
//                   <img
//                     src={TempleQuest}
//                     alt="quest"
//                     className="mb-[6px] -mt-[50px] w-[60px] h-[60px] rounded-[12px] object-cover"
//                   />

//                   <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
//                     TEMPLE RUN
//                   </p>
//                   <div className="flex items-center justify-center mt-[9.8px]">
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                   </div>

//                   <Link to="#">
//                     <button
//                       onClick={() => handleTemplePlay(TempleRunUrl, msisdn)}
//                       className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]"
//                     >
//                       Play
//                     </button>
//                   </Link>
//                 </div>

//                 <div className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]">
//                   <img
//                     src={XWinger}
//                     alt="forknite"
//                     className="mb-[6px] -mt-[50px] w-[60px] h-[60px] rounded-[12px] object-cover"
//                   />

//                   <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
//                     X WING FIGHTER
//                   </p>
//                   <div className="flex items-center justify-center mt-[9.8px]">
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                   </div>

//                   <Link to="#">
//                     <button
//                       onClick={() => handlePlay(XwingFighterUrl, msisdn)}
//                       className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]"
//                     >
//                       Play
//                     </button>
//                   </Link>
//                 </div>

//                 {/* ))} */}
//               </div>
//             </div>
//             <BigCashGame />
//           </section>
//         </div>

//         {iframeSrc && (
//           <div className="absolute inset-0 bg-white z-50">
//             <iframe
//               src={iframeSrc}
//               title="Game"
//               sandbox="allow-scripts allow-same-origin"
//               className="w-full h-full"
//             />
//             <button
//               onClick={handleBackToApp}
//               className="absolute top-4 right-4 bg-sky-900 text-white px-4 py-2 rounded"
//             >
//               Back to App
//             </button>
//           </div>
//         )}

//         <div className="fixed w-full flex justify-center  ">
//           <div
//             style={navStyle}
//             className="bottom-0 backdrop-blur-sm mb-[15px] md:mb-[50px]   left-0px flex justify-between items-center w-[342px] h-[82px] bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px] "
//           >
//             <Link
//               to="/home"
//               className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
//             >
//               <img src={Home} alt="home" />
//             </Link>
//             <Link
//               to="/user-profile"
//               className="bg-[#FFCB05] rounded-[50px] w-[76px] h-[76px] flex items-center justify-center -mt-[40px]"
//             >
//               <img src={Profile} alt="profile" className="w-[40px] h-[40px]" />
//             </Link>
//             <Link
//               to="/leaderboard"
//               className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
//             >
//               <img src={Leaderboard} alt="leaderboard" />
//             </Link>
//           </div>
//         </div>

//         {showAvatarSelector && (
//           <div className="flex items-center justify-center mx-auto">
//             <div className="absolute top-[30px] left-auto w-[265px] h-[138px]  bg-background-avatar  rounded-[26px]  ">
//               <div className="flex  ">
//                 <img
//                   src={currentAvatar || "/default-avatar.png"}
//                   alt="Profile Avatar"
//                 />
//                 <p className="text-white pt-[12px] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-center w-[126px]">
//                   Please select an avatar
//                 </p>
//                 {selectedAvatar && (
//                   <button
//                     className="text-[#FFCB05] ml-[32px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center  -mt-[5px]"
//                     onClick={handleSave}
//                   >
//                     Save
//                   </button>
//                 )}
//               </div>

//               <div className="flex px-[10px] mt-4">
//                 {avatars.map((avatar, index) => (
//                   <div
//                     key={index}
//                     className={`relative  ${
//                       selectedAvatar === avatar
//                         ? "border-[3px] rounded-[28px] flex items-center justify-center border-[#FFCB05]"
//                         : ""
//                     } cursor-pointer`}
//                     onClick={() => handleAvatarSelect(avatar)}
//                   >
//                     <img
//                       src={avatar}
//                       alt={`Avatar ${index + 1}`}
//                       className="w-[50px] h-[50px]"
//                     />
//                     {selectedAvatar !== avatar && (
//                       <div className=" absolute bottom-[5px] right-0  w-[10px] h-[10px]  bg-[#FFCB05] rounded-[28px]">
//                         <img
//                           src={PlusIcon}
//                           alt="Plus Icon"
//                           className="w-[15px] h-[15px]  "
//                         />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default HomePage;



// import axios from "axios";

// const authApi = async () => {
//   try {
//     const response = await axios.post(
//       "https://ydvassdp.com:5001/api/YellowdotGames/Authorization/Login",
//       {
//         username: "games_sa_ydotgames",
//         password: "password",
//       }
//     );

//     const { jwtToken, tokenExpiry, username } = response.data;

//     // Calculate the expiry time (current time + token expiry in milliseconds)
//     const expiryTime = new Date().getTime() + tokenExpiry * 1000; // tokenExpiry is expected to be in seconds

//     localStorage.setItem("authToken", jwtToken);
//     localStorage.setItem("tokenExpiry", expiryTime);
//     localStorage.setItem("username", username);
    
//     return response.data;
//   } catch (error) {
//     console.error("Authorization failed:", error);
//     throw error;
//   }
// };

// export default authApi;


// const isTokenExpired = () => {
//     const tokenExpiry = localStorage.getItem("tokenExpiry");
//     return !tokenExpiry || new Date().getTime() > tokenExpiry;
//   };
  

//   const apiCallWithAuth = async (url, method = 'GET', data = null) => {
//     // Check if the token is expired
//     if (isTokenExpired()) {
//       await authApi(); // Refresh the token
//     }
  
//     const token = localStorage.getItem("authToken");
  
//     // Make the API call with the token
//     try {
//       const response = await axios({
//         url,
//         method,
//         data,
//         headers: {
//           Authorization: `Bearer ${token}`, // Use the token for authorization
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("API call failed:", error);
//       throw error;
//     }
//   };
  
//   // Usage example
//   // await apiCallWithAuth("https://yourapi.com/endpoint", "GET");
  


//   // src/api/authApi.js

// import axios from "axios";

// const authApi = async () => {
//   try {
//     const response = await axios.post(
//       "https://ydvassdp.com:5001/api/YellowdotGames/Authorization/Login",
//       {
//         username: "games_sa_ydotgames",
//         password: "password",
//       }
//     );

//     const { jwtToken, tokenExpiry, username } = response.data;

//     // Store token and expiry time
//     const expiryTime = new Date().getTime() + tokenExpiry * 1000; // Convert to milliseconds
//     localStorage.setItem("authToken", jwtToken);
//     localStorage.setItem("tokenExpiry", expiryTime);
//     localStorage.setItem("username", username);

//     return response.data;
//   } catch (error) {
//     console.error("Authorization failed:", error);
//     throw error;
//   }
// };

// // Check if the token has expired
// const isTokenExpired = () => {
//   const tokenExpiry = localStorage.getItem("tokenExpiry");
//   return !tokenExpiry || new Date().getTime() > tokenExpiry;
// };

// // Function to get the current token
// const getToken = () => {
//   return localStorage.getItem("authToken");
// };

// // Function to refresh token if expired
// const refreshAuthToken = async () => {
//   if (isTokenExpired()) {
//     return await authApi(); // Call the authApi to refresh the token
//   }
//   return getToken(); // Return the current token if not expired
// };

// export { authApi, isTokenExpired, refreshAuthToken, getToken };



// // src/context/AuthContext.js

// import { refreshAuthToken } from "./authApi"; // Import your auth utilities

// const someApiCall = async () => {
//   try {
//     const token = await refreshAuthToken(); // Ensure token is valid before making request
//     const response = await axios.get("https://some-api-endpoint.com/data", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("API call failed:", error);
//     throw error;
//   }
// };


// import { createContext, useState, useEffect, useContext } from "react";
// import { authApi, refreshAuthToken, getToken } from "../api/authApi";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState(null);

//   const login = async () => {
//     try {
//       const data = await authApi();
//       setAuth({
//         token: data.jwtToken,
//         tokenExpiry: data.tokenExpiry,
//         username: data.username,
//       });
//     } catch (error) {
//       console.error("Login error:", error);
//     }
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = getToken();
//       if (token && !isTokenExpired()) {
//         // If token exists and is not expired, set the auth state
//         setAuth({
//           token,
//           tokenExpiry: localStorage.getItem("tokenExpiry"),
//           username: localStorage.getItem("username"),
//         });
//       } else {
//         // If token is expired or doesn't exist, log in to get a new token
//         await login();
//       }
//     };

//     checkAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ auth, refreshAuthToken }}>{children}</AuthContext.Provider>
//   );
// };

// export default AuthContext;


// import { createContext, useState, useEffect, useContext } from "react";
// import { authApi, refreshAuthToken, getToken, isTokenExpired } from "../api/authApi";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({
//     token: null,
//     tokenExpiry: null,
//     username: null,
//     loading: true,
//     error: null,
//   });

//   const login = async () => {
//     try {
//       const data = await authApi();
//       setAuth({
//         token: data.jwtToken,
//         tokenExpiry: new Date().getTime() + data.tokenExpiry * 1000, // Set expiry time
//         username: data.username,
//         loading: false,
//       });
//     } catch (error) {
//       console.error("Login error:", error);
//       setAuth((prev) => ({ ...prev, error: "Login failed", loading: false }));
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("tokenExpiry");
//     localStorage.removeItem("username");
//     setAuth({ token: null, tokenExpiry: null, username: null, loading: false });
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = getToken();
//       if (token && !isTokenExpired()) {
//         setAuth({
//           token,
//           tokenExpiry: localStorage.getItem("tokenExpiry"),
//           username: localStorage.getItem("username"),
//           loading: false,
//         });
//       } else {
//         await login();
//       }
//     };
//     checkAuth();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (isTokenExpired()) {
//         refreshAuthToken(); // Refresh token if expired
//       }
//     }, 60000); // Check every minute

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, []);

//   return (
//     <AuthContext.Provider value={{ auth, login, logout }}>
//       {auth.loading ? <div>Loading...</div> : children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;
// export const useAuthContext = () => useContext(AuthContext);


// import { useContext } from "react";
// import axios from "axios";
// import AuthContext from "../Context/AuthContext";

// const BASE_URL = "https://ydvassdp.com:5001/api/YellowdotGames";

// const useUserApi = () => {
//   const { auth, refreshAuthToken } = useContext(AuthContext);

//   const createSubscriberProfile = async (msisdn, nickname, avatarId) => {
//     try {
//       await refreshAuthToken();

//       const payload = {
//         msisdn,
//         nickname,
//         avatarId,
//       };

//       const response = await axios.post(`${BASE_URL}/CreateSubscriberProfile`, payload, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`, 
//         },
//       });

//       return response.data;
//     } catch (error) {
//       console.error("Error creating subscriber profile:", error);
//       throw error;
//     }
//   };

//   const getSubscriberProfile = async (msisdn) => {
//     try {
//       await refreshAuthToken();

//       const response = await axios.get(
//         `${BASE_URL}/GetSubscriberProfile?msisdn=${msisdn}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${auth.token}`,
//           },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       console.error("Error fetching subscriber profile:", error);
//       throw error;
//     }
//   };

//   const updateSubscriberProfile = async (msisdn, nickname, avatarId) => {
//     try {
//       await refreshAuthToken();

//       const payload = {
//         msisdn,
//         nickname,
//         avatarId,
//       };

//       const response = await axios.put(
//         `${BASE_URL}/UpdateSubscriberProfile`,
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${auth.token}`,
//           },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       console.error("Error updating subscriber profile:", error);
//       throw error;
//     }
//   };

//   return {
//     createSubscriberProfile,
//     getSubscriberProfile,
//     updateSubscriberProfile,
//   };
// };

// export default useUserApi;


// import React from "react";
// import useUserApi from "./path/to/userApi"; // Update with your actual path

// const YourComponent = () => {
//   const { createSubscriberProfile, getSubscriberProfile, updateSubscriberProfile } = useUserApi();

//   const handleProfileUpdate = async () => {
//     try {
//       const data = await createSubscriberProfile("27784164170", "nickname", "avatarId");
//       console.log(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleProfileUpdate}>Update Profile</button>
//     </div>
//   );
// };

// export default YourComponent;



// import axios from "axios";
// import AuthContext from "../context/AuthContext";

// const MyComponent = () => {
//   const { auth, refreshAuthToken } = useContext(AuthContext);
//   const [profileData, setProfileData] = useState(null);
//   const [leaderboardData, setLeaderboardData] = useState(null);

//   const fetchProfileData = async () => {
//     try {
//       // Ensure the token is valid before making the request
//       await refreshAuthToken();

//       const response = await axios.get("https://ydvassdp.com:5001/api/UserProfile/api/YellowdotGames/GetSubscriberProfile", {
//         headers: {
//           Authorization: `Bearer ${auth.token}`, // Use the token as Bearer
//         },
//       });

//       setProfileData(response.data);
//     } catch (error) {
//       console.error("Failed to fetch profile data:", error);
//     }
//   };

//   const fetchLeaderboardData = async () => {
//     try {
//       // Ensure the token is valid before making the request
//       await refreshAuthToken();

//       const response = await axios.get("https://ydvassdp.com:5001/api/Leaderboard/api/YourLeaderboardEndpoint", {
//         headers: {
//           Authorization: `Bearer ${auth.token}`, // Use the token as Bearer
//         },
//       });

//       setLeaderboardData(response.data);
//     } catch (error) {
//       console.error("Failed to fetch leaderboard data:", error);
//     }
//   };

//   useEffect(() => {
//     // Fetch profile data on component mount
//     fetchProfileData();
//     fetchLeaderboardData();
//   }, []);

//   return (
//     <div>
//       <h1>Welcome, {auth?.username}</h1>
      
//       {profileData && (
//         <div>
//           <h2>Your Profile</h2>
//           <pre>{JSON.stringify(profileData, null, 2)}</pre>
//         </div>
//       )}

//       {leaderboardData && (
//         <div>
//           <h2>Leaderboard</h2>
//           <pre>{JSON.stringify(leaderboardData, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyComponent;


// const getSubscriberProfile = async (auth, msisdn) => {
//     try {
//       if (typeof refreshAuthToken !== "function") {
//         throw new Error("refreshAuthToken is not a function");
//       }
  
//       await refreshAuthToken();
  
//       console.log("Auth Token:", auth.token); // Log the token to check its value
  
//       const response = await axios.get(
//         `${BASE_URL}/GetSubscriberProfile?msisdn=${msisdn}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${auth.token}`,
//           },
//         }
//       );
  
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching subscriber profile:", error);
//       throw error;
//     }
//   };

//   const refreshAuthToken = async () => {
//     try {
//       // Logic to refresh the token
//       const newToken = await someTokenRefreshFunction(); // Replace with actual logic
//       setAuth((prevAuth) => ({ ...prevAuth, token: newToken }));
//     } catch (error) {
//       console.error("Failed to refresh auth token:", error);
//       throw error;
//     }
//   };

//   auth context
//   import React, { createContext, useContext, useState } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({ token: null });

//   return (
//     <AuthContext.Provider value={{ auth, setAuth }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// userapi
// import { useAuth } from './AuthContext'; // Adjust the import based on your file structure

// const getSubscriberProfile = async (msisdn) => {
//   const { auth, setAuth } = useAuth(); // Destructure auth and setAuth from context

//   try {
//     await refreshAuthToken();

//     const response = await axios.get(
//       `${BASE_URL}/GetSubscriberProfile?msisdn=${msisdn}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`,
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Error fetching subscriber profile:", error);
//     throw error;
//   }
// };
// authapi
// import { useAuth } from './AuthContext';
// import { redirect } from 'react-router-dom';

// const refreshAuthToken = async () => {
//   const { setAuth } = useAuth(); // Get setAuth from context

//   // Logic to refresh the token
//   const newToken = await someTokenRefreshFunction(); // Replace with actual logic

//   setAuth((prevAuth) => ({ ...prevAuth, token: newToken }));
// };

//   redirect
//   import { useAuth } from './AuthContext'; // Adjust the import based on your file structure

// const checkSubscription = () => {
//   const { auth } = useAuth(); // Destructure auth from context

//   // Use auth in your logic here
//   if (!auth.token) {
//     // Handle case where auth.token is not defined
//   }
// };


// AuthContext.js
// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const refreshAuthToken = async () => {
//     // Logic to refresh the token
//   };

//   return (
//     <AuthContext.Provider value={{ auth, refreshAuthToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;

// import { useContext } from "react";
// import AuthContext from "../context/AuthContext";

// const MyComponent = () => {
//   const { auth, refreshAuthToken } = useContext(AuthContext);

//   const handleSomeAction = async () => {
//     // Refresh the token if necessary
//     await refreshAuthToken();

//     // Now you can use auth token for your API calls
//     const token = auth?.token;
//     console.log("Using token:", token);
//   };

//   return (
//     <div>
//       <h1>Welcome, {auth?.username}</h1>
//       <button onClick={handleSomeAction}>Perform Action</button>
//     </div>
//   );
// };


// import { createContext, useState, useEffect, useContext } from "react";
// import { authApi, refreshAuthToken, getToken, isTokenExpired } from "../api/authApi";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({
//     token: null,
//     tokenExpiry: null,
//     username: null,
//     loading: true,
//     error: null,
//   });

//   // Function to handle login
//   const login = async () => {
//     try {
//       const data = await authApi();
//       setAuth({
//         token: data.jwtToken,
//         tokenExpiry: data.tokenExpiry, // Already in milliseconds
//         username: data.username,
//         loading: false,
//         error: null,
//       });
//     } catch (error) {
//       console.error("Login error:", error);
//       setAuth((prev) => ({ ...prev, error: error.message, loading: false }));
//     }
//   };

//   // Function to handle logout
//   const logout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("tokenExpiry");
//     localStorage.removeItem("username");
//     setAuth({ token: null, tokenExpiry: null, username: null, loading: false, error: null });
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = getToken();
//       if (token && !isTokenExpired()) {
//         setAuth({
//           token,
//           tokenExpiry: localStorage.getItem("tokenExpiry"),
//           username: localStorage.getItem("username"),
//           loading: false,
//           error: null,
//         });
//       } else {
//         await login();
//       }
//     };
//     checkAuth();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (isTokenExpired()) {
//         refreshAuthToken(); // Refresh token if expired
//       }
//     }, 60000); // Check every minute

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, []);

//   return (
//     <AuthContext.Provider value={{ auth, login, logout }}>
//       {auth.loading ? <div>Loading...</div> : children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;
// export const useAuthContext = () => useContext(AuthContext);






// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Timer from "../assets/Icons/timer.svg";
// import { LeaderboardContext } from "../Context/LeaderboardContext";
// import { TriviaContext } from "../Context/TriviaContext";
// import UserContext from "../Context/UserContext";
// import { Circles } from "react-loader-spinner";

// const BigCashTrivia = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [score, setScore] = useState(0);
//   const [statuses, setStatuses] = useState([]);
//   const [timer, setTimer] = useState(10);
//   const navigate = useNavigate();

//   const { msisdn } = useContext(UserContext);
//   const { gameId } = useParams();
//   const { handleUpdateLeaderboardScore } = useContext(LeaderboardContext);
//   const {
//     loading,
//     fetchQuestions,
//     questions,
//     selectedGameId,
//     handleAnswerSubmit,
//   } = useContext(TriviaContext);

//   useEffect(() => {
//     if (selectedGameId) {
//       fetchQuestions(selectedGameId);
//     }
//   }, [selectedGameId]);

//   useEffect(() => {
//     if (questions.length > 0) {
//       setCurrentQuestionIndex(0);
//       setSelectedAnswer(null);
//       setTimer(10);
//       setStatuses(Array(questions.length).fill(null));
//     }
//   }, [questions]);

//   useEffect(() => {
//     const timerId = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerId);
//           handleNextQuestion(false);
//           return 10;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [currentQuestionIndex]);

//   const handleAnswerClick = async (answer) => {
//     if (selectedAnswer) return;

//     setSelectedAnswer(answer);
//     const questionId = questions[currentQuestionIndex].id;
//     const response = await handleAnswerSubmit(msisdn, questionId, answer);
//     console.log("Submit answer response:", response);

//     const isAnswerCorrect =
//       answer === questions[currentQuestionIndex]?.rightAnswer;

//     setStatuses((prevStatuses) => {
//       const newStatuses = [...prevStatuses];
//       newStatuses[currentQuestionIndex] = isAnswerCorrect
//         ? "correct"
//         : "incorrect";
//       console.log("Updated statuses:", newStatuses);
//       return newStatuses;
//     });

//     if (response && response.statusCode === "999") {
//       const pointsMessage = response.message;
//       const awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
//       console.log(`Awarded Points: ${awardedPoints}`);
//       setScore((prevScore) => prevScore + awardedPoints);
//     } else {
//       console.error("Failed to submit answer:", response);
//     }

//     setTimeout(() => {
//       handleNextQuestion(isAnswerCorrect);
//     }, 2000);
//   };

//   const handleNextQuestion = (answeredCorrectly) => {
//     setSelectedAnswer(null);
//     setTimer(10);

//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     } else {
//       console.log("All questions answered. Final Score:", score);
//       handleUpdateLeaderboardScore(msisdn, score);

//       setTimeout(() => {
//         navigate("/result-page", {
//           state: {
//             score: score,
//             totalQuestions: questions.length,
//             statuses: [...statuses],
//           },
//         });
//       }, 2000);
//     }
//   };

//   if (loading || !questions || questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center mx-auto mt-[50px]">
//         <Circles color="black" height={50} width={50} />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen bg-darrk-gradient text-white">
//       <div className="mt-[60px] mb-[30px]">
//         <div className="flex items-center justify-center bg-white w-[46px] h-[46px] border rounded-[50px]">
//           <img className="img-timer" src={Timer} alt="timer" />
//           <p className="text-black text-[18px] font-mtn-brighter-medium font-medium text-center">
//             {timer}
//           </p>
//         </div>
//       </div>

//       <div className="p-4 text-center">
//         <h2 className="text-[24px] text-white leading-[24px] font-bold font-mtn-brighter-bold text-center mb-[47px]">
//           {questions[currentQuestionIndex]?.text || "No question available."}
//         </h2>

//         {/* Pagination Dots */}
//         <div className="flex items-center justify-center mt-4 mb-[59px] gap-[25px] px-4">
//           {questions.map((_, index) => (
//             <div
//               key={index}
//               className={`w-3 h-3 rounded-full ${
//                 statuses[index] === "correct"
//                   ? "bg-[#82e180]"
//                   : statuses[index] === "incorrect"
//                   ? "bg-[#e37e80]"
//                   : "bg-gray-500"
//               }`}
//             />
//           ))}
//         </div>

//         <div className="flex flex-col gap-[21px]">
//           {questions[currentQuestionIndex].answers.map((answer, index) => (
//             <button
//               key={index}
//               onClick={() => handleAnswerClick(answer)}
//               className={`py-2 px-4 text-black rounded-[50px] w-[90vw] h-[60px] ${
//                 selectedAnswer === answer
//                   ? answer === questions[currentQuestionIndex].rightAnswer
//                     ? "bg-[#82e180]"
//                     : "bg-[#e37e80]"
//                   : selectedAnswer &&
//                     answer === questions[currentQuestionIndex].rightAnswer
//                   ? "bg-[#82e180]"
//                   : "bg-white"
//               }`}
//               disabled={selectedAnswer !== null}
//             >
//               {answer}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default React.memo(BigCashTrivia);




// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Timer from "../assets/Icons/timer.svg";
// import { LeaderboardContext } from "../Context/LeaderboardContext";
// import { TriviaContext } from "../Context/TriviaContext";
// import UserContext from "../Context/UserContext";
// import { Circles } from "react-loader-spinner";

// const BigCashTrivia = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [score, setScore] = useState(0);
//   const [statuses, setStatuses] = useState([]);
//   const [timer, setTimer] = useState(10);
//   const navigate = useNavigate();

//   const { userProfile, msisdn } = useContext(UserContext);
//   const { gameId } = useParams();
//   const { handleUpdateLeaderboardScore } = useContext(LeaderboardContext);

//   const {
//     loading,
//     fetchQuestions,
//     questions,
//     selectedGameId,
//     handleAnswerSubmit,
//   } = useContext(TriviaContext);

//   useEffect(() => {
//     if (selectedGameId) {
//       fetchQuestions(selectedGameId);
//     }
//   }, [selectedGameId]);

//   useEffect(() => {
//     if (questions.length > 0) {
//       setCurrentQuestionIndex(0);
//       setSelectedAnswer(null);
//       setIsCorrect(null);
//       setTimer(10);
//       setStatuses(Array(questions.length).fill(null));
//     }
//   }, [questions]);

//   useEffect(() => {
//     const timerId = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerId);
//           handleNextQuestion(false);
//           return 10;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [currentQuestionIndex]);


//   const handleAnswerClick = async (answer) => {
//     if (selectedAnswer) return;

//     setSelectedAnswer(answer);
//     const questionId = questions[currentQuestionIndex].id;
//     const response = await handleAnswerSubmit(msisdn, questionId, answer);

//     console.log("Submit answer response:", response);

//     const isAnswerCorrect =
//       answer === questions[currentQuestionIndex]?.rightAnswer;
//     // setIsCorrect(isAnswerCorrect);

//     // setStatuses((prev) => {
//     //   const newStatuses = [...prev];
//     //   newStatuses[currentQuestionIndex] = isAnswerCorrect
//     //     ? "correct"
//     //     : "incorrect";
//     //   return newStatuses;
//     // });
//     setStatuses((prevStatuses) => {
//       const newStatuses = [...prevStatuses];
//       newStatuses[currentQuestionIndex] = isAnswerCorrect ? "correct" : "incorrect";
//       console.log("Updated statuses:", newStatuses); // Log updated statuses
//       return newStatuses;
//   });

//   if (isAnswerCorrect) {
//     const awardedPoints = 10; // Assuming 10 points for each correct answer
//     setScore((prevScore) => prevScore + awardedPoints);
//     console.log("Awarded Points:", awardedPoints);
//   }

//   setTimeout(() => {
//     handleNextQuestion(isAnswerCorrect); // Proceed to the next question
//   }, 2000);
// };




//     if (response && response.statusCode === "999") {
//       if (isAnswerCorrect) {
//         const pointsMessage = response.message;
//         const awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
//         console.log(`Awarded Points: ${awardedPoints}`);
//         setScore((prevScore) => prevScore + awardedPoints);
//       }
//       console.log("Statuses before transitioning:", statuses);
//     if (response && response.statusCode === "999") {
//       const pointsMessage = response.message;
//       const awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
//       setScore((prevScore) => prevScore + awardedPoints);
//       console.log("Awarded Points:", awardedPoints); // Log awarded points
//   }
//   setTimeout(() => {
//     if (currentQuestionIndex + 1 < questions.length) {
//         handleNextQuestion(isAnswerCorrect); // Proceed to next question
//     } else {
//         console.log("All questions answered. Final Score:", score);
//         // Optionally: Navigate to the result page
//         // navigateToResults();
//     }
// }, 2000);
//       setTimeout(() => {
//         handleNextQuestion(isAnswerCorrect);
//       }, 3000);
//     } else {
//       console.error("Failed to submit answer:", response);
//     }
//   };

//   // const handleNextQuestion = (answeredCorrectly) => {
//   //   setSelectedAnswer(null);
//   //   setIsCorrect(null);
//   //   setTimer(10);

//   const handleNextQuestion = () => {
//     setSelectedAnswer(null);
//     setIsCorrect(null);
//     setTimer(10);
  

//     // setStatuses((prev) => {
//     //   const newStatuses = [...prev];
//     //   newStatuses[currentQuestionIndex] = answeredCorrectly
//     //     ? "correct"
//     //     : "incorrect";
//     //   return newStatuses;
//     // });

//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     } else {
//       // const lastQuestionStatus = answeredCorrectly ? "correct" : "incorrect";

//       // setStatuses((prevStatuses) => {
//       //   const newStatuses = [...prevStatuses];
//       //   newStatuses[currentQuestionIndex] = answeredCorrectly ? "correct" : "incorrect"; // Set status for last question
//       //   console.log("Final statuses array before navigating:", newStatuses);

//       //   return newStatuses;
//       // });
//       console.log("All questions answered. Final Score:", score);
//       console.log("Final statuses array:", statuses);
  
//       handleUpdateLeaderboardScore(msisdn, score);

//       setTimeout(() => {
//         navigate("/result-page", {
//           state: {
//             score: score,
//             totalQuestions: questions.length,
//             statuses: [...statuses],
//           },
//         });
//       }, 2000);
//     }
//   };


//   if (loading || !questions || questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center mx-auto mt-[50px]">
//         <Circles color="black" height={50} width={50} />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen bg-darrk-gradient text-white">
//       <div className="mt-[60px] mb-[30px]">
//         <div className="flex items-center justify-center bg-white w-[46px] h-[46px] border rounded-[50px]">
//           <img className="img-timer" src={Timer} alt="timer" />
//           <p className="text-black text-[18px] font-mtn-brighter-medium font-medium text-center">
//             {timer}
//           </p>
//         </div>
//       </div>

//       <div className="p-4 text-center">
//         <h2 className="text-[24px] text-white leading-[24px] font-bold font-mtn-brighter-bold text-center mb-[47px]">
//           {questions[currentQuestionIndex]?.text || "No question available."}
//         </h2>

//         {/* Pagination Dots */}
//         <div className="flex items-center justify-center mt-4 mb-[59px] gap-[25px] px-4">
//           {questions.map((_, index) => (
//             <div
//               key={index}
//               className={`w-3 h-3 rounded-full ${
//                 statuses[index] === "correct"
//                   ? "bg-[#82e180]"
//                   : statuses[index] === "incorrect"
//                   ? "bg-[#e37e80]"
//                   : "bg-gray-500"
//               }`}
//             />
//           ))}
//         </div>

//         <div className="flex flex-col gap-[21px]">
//           {/* {!questions[currentQuestionIndex]?.answers || */}
//           {/* // questions[currentQuestionIndex].answers.length === 0 ? (
//             // <div>No answer options available.</div>
//           // ) : ( */}
//             {/* {questions && questions[currentQuestionIndex] && questions[currentQuestionIndex].answers ? ( */}

//            {questions[currentQuestionIndex].answers.map((answer, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleAnswerClick(answer)}
//                 className={`py-2 px-4 text-black rounded-[50px] w-[90vw] h-[60px] ${
//                   selectedAnswer === answer
//                     ? answer === questions[currentQuestionIndex].rightAnswer
//                       ? "bg-[#82e180]"
//                       : "bg-[#e37e80]"
//                     : selectedAnswer &&
//                       answer === questions[currentQuestionIndex].rightAnswer
//                     ? "bg-[#82e180]"
//                     : "bg-white"
//                 }`}
//                 disabled={selectedAnswer !== null}
//               >
//                 {answer}
//               </button>
//             ))}
//             {/* // ) : (
//             //   <div>Loading...</div>
//             // )} */}
//               {/* // } */}
//           {/* )} */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default React.memo(BigCashTrivia);



// import React, { useEffect, useState } from 'react';

// const AvatarSelector = ({ avatars }) => {
//   const [selectedAvatar, setSelectedAvatar] = useState(null);
//   const [currentAvatar, setCurrentAvatar] = useState("/default-avatar.png"); // Default avatar
//   const [showAvatarSelector, setShowAvatarSelector] = useState(false);
//   const [error, setError] = useState("");
//   const storedMsisdn = localStorage.getItem('cli');

//   useEffect(() => {
//     const storedAvatar = localStorage.getItem("selectedAvatar");
//     if (storedAvatar) {
//       setSelectedAvatar(storedAvatar);
//       setCurrentAvatar(storedAvatar); // Show stored avatar if exists
//     } else {
//       setCurrentAvatar("/default-avatar.png"); // Set default avatar if none selected
//     }
//   }, []);

//   const handleAvatarClick = () => {
//     setShowAvatarSelector(!showAvatarSelector);
//   };

//   const handleAvatarSelect = (avatarId) => {
//     setSelectedAvatar(avatarId);
//   };

//   const handleSave = async () => {
//     try {
//       if (!selectedAvatar) return;
//       const avatarId = avatars.indexOf(selectedAvatar) + 1;

//       const msisdn = storedMsisdn; // Using stored MSISDN directly
//       if (!msisdn) {
//         setError("MSISDN is required");
//         console.log("MSISDN is required");
//         return;
//       }
//       const nickname = msisdn;

//       console.log("avatar saved", avatarId);
//       localStorage.setItem("selectedAvatar", selectedAvatar);

//       await handleUpdateSubscriberProfile(msisdn, nickname, avatarId);

//       setCurrentAvatar(selectedAvatar); // Update current avatar to selected
//       setShowAvatarSelector(false);
//     } catch (error) {
//       console.error("Error saving avatar:", error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleAvatarClick}>
//         {currentAvatar && (
//           <img src={currentAvatar} alt="Current Avatar" className="w-[50px] h-[50px]" />
//         )}
//       </button>

//       {showAvatarSelector && (
//         <div className="flex items-center justify-center mx-auto">
//           <div className="absolute top-[30px] left-auto w-[265px] h-[138px] bg-background-avatar rounded-[26px]">
//             <div className="flex">
//               <img
//                 src={currentAvatar}
//                 alt="Profile Avatar"
//               />
//               <p className="text-white pt-[12px] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-center w-[126px]">
//                 Please select an avatar
//               </p>
//               {selectedAvatar && (
//                 <button
//                   className="text-[#FFCB05] ml-[32px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center -mt-[5px]"
//                   onClick={handleSave}
//                 >
//                   Save
//                 </button>
//               )}
//             </div>

//             <div className="flex px-[10px] mt-4">
//               {avatars.map((avatar, index) => (
//                 <div
//                   key={index}
//                   className={`relative ${
//                     selectedAvatar === avatar
//                       ? "border-[3px] rounded-[28px] flex items-center justify-center border-[#FFCB05]"
//                       : ""
//                   } cursor-pointer`}
//                   onClick={() => handleAvatarSelect(avatar)}
//                 >
//                   <img
//                     src={avatar}
//                     alt={`Avatar ${index + 1}`}
//                     className="w-[50px] h-[50px]"
//                   />
//                   {selectedAvatar !== avatar && (
//                     <div className="absolute bottom-[5px] right-0 w-[10px] h-[10px] bg-[#FFCB05] rounded-[28px]">
//                       <img
//                         src={PlusIcon}
//                         alt="Plus Icon"
//                         className="w-[15px] h-[15px]"
//                       />
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AvatarSelector;



// import React, { createContext, useContext, useState, useEffect } from "react";
// import { getSubscriberProfile, UpdateSubscriberProfile } from "../api/userApi";
// import AuthContext from "../Context/AuthContext";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [userProfile, setUserProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { auth } = useContext(AuthContext);

//   const [msisdn, setMsisdn] = useState(() => {
//     const savedMsisdn = localStorage.getItem("cli");
//     return savedMsisdn || "";
//   });

//   useEffect(() => {
//     if (auth?.token && msisdn) {
//       console.log("Fetching profile with MSISDN:", msisdn);

//       fetchProfile(msisdn);
//     }
//   }, [auth?.token, msisdn]);

//   const fetchProfile = async (msisdn) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const profileData = await getSubscriberProfile(auth, msisdn);
//       console.log("Profile Data:", profileData);

//       if (profileData.statusCode === "999") {
//         setUserProfile(profileData.data);
//       } else {
//         setError(profileData.statusMessage);
//       }
//     } catch (error) {
//       console.error("Failed to fetch profile", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateSubscriberProfile = async (msisdn, nickname, avatarId) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await UpdateSubscriberProfile(
//         auth,
//         msisdn,
//         nickname,
//         avatarId || ""
//       );
//       if (response.statusCode === "999") {
//         setUserProfile((prev) => ({ ...prev, avatarID: avatarId }));
//       } else {
//         setError(response.statusMessage);
//       }
//     } catch (error) {
//       console.error("Failed to update profile", error);
//       setError("Error updating profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <UserContext.Provider
//       value={{
//         userProfile,
//         loading,
//         error,
//         msisdn,
//         setMsisdn,
//         fetchProfile,
//         handleUpdateSubscriberProfile,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserContext;
// export const useUserContext = () => useContext(UserContext);




// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { Alert, Button, View, Text, ActivityIndicator } from 'react-native';
// import Tts from 'react-native-tts';
// import CountDownTimer from 'react-native-countdown-timer-hooks';
// import { apiGet, apiPost } from '../../api-services/apiService';
// import paths from '../../api-services/endpoints';
// import Sound from 'react-native-sound';
// import ResultBox from './ResultBox'; // Assuming you have a similar ResultBox component

// Sound.setCategory('Playback');

// const successSound = new Sound('success.mp3', Sound.MAIN_BUNDLE);
// const failedSound = new Sound('failed.mp3', Sound.MAIN_BUNDLE);

// const BigCashTrivia = ({ navigation, route }) => {
//   const { level, stage, mode, name } = route.params;
  
//   const [questions, setQuestions] = useState([]);
//   const [results, setResults] = useState(Array(10).fill(null));
//   const [questionIndex, setQuestionIndex] = useState(0);
//   const [sessionId, setSessionId] = useState(null);
//   const [userAnswer, setUserAnswer] = useState('');
//   const [timer, setTimer] = useState(10);
//   const [testOver, setTestOver] = useState(false);

//   useEffect(() => {
//     Tts.setDefaultLanguage('en-US');
//     Tts.setDefaultVoice('com.apple.ttsbundle.Samantha-compact');
    
//     const fetchQuestions = async () => {
//       try {
//         const res = await apiGet(paths.generateQuestions(level, stage));
//         setQuestions(res?.data?.data?.test);
//         setSessionId(res?.data?.data?.session_id);
//         setTimer(res?.data?.data?.seconds_per_question);
//       } catch (error) {
//         Alert.alert('Error', error.message || 'Something went wrong');
//         navigation.goBack();
//       }
//     };

//     fetchQuestions();
//   }, [level, stage, navigation]);

//   useEffect(() => {
//     if (!testOver) {
//       readText(questions[questionIndex]?.question);
//     }
//   }, [questions, questionIndex, testOver]);

//   const readText = async (text) => {
//     Tts.stop();
//     Tts.speak(text);
//   };

//   const handleNextQuestion = useCallback(() => {
//     if (questionIndex < questions.length - 1) {
//       setQuestionIndex(prev => prev + 1);
//     } else {
//       setTestOver(true);
//     }
//   }, [questionIndex, questions.length]);

//   const handleSubmit = useCallback(() => {
//     const currentQuestion = questions[questionIndex];
//     const isCorrect = parseFloat(userAnswer) === currentQuestion?.answer;

//     const newResults = [...results];
//     newResults[questionIndex] = isCorrect ? 'correct' : 'fail';
//     setResults(newResults);

//     if (isCorrect) {
//       successSound.play();
//     } else {
//       failedSound.play();
//     }

//     handleNextQuestion();
//   }, [userAnswer, questionIndex, questions, results, handleNextQuestion]);

//   useEffect(() => {
//     if (testOver) {
//       const finalResults = results;
//       // Process final results (like sending to the server)
//       const resultData = {
//         session_id: sessionId,
//         result: questions.map((question, idx) => ({
//           question: question.question,
//           answer: question.answer,
//           id: idx + 1,
//           correct: finalResults[idx] === 'correct',
//         })),
//       };
//       apiPost(paths.submitAnswers, resultData);
      
//       const scoreMessage = calculatePercentage(finalResults) < 70
//         ? 'Oh, you scored below the pass mark, please try the test again'
//         : 'Congratulations!! Good job';
      
//       readText(scoreMessage);
//     }
//   }, [testOver, results, questions, sessionId]);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       {questions.length === 0 ? (
//         <ActivityIndicator />
//       ) : (
//         <View>
//           <Text>{questions[questionIndex]?.question}</Text>
//           {/* Render answer options here */}
//           <Button title="Submit Answer" onPress={handleSubmit} />
//           <ResultBox results={results} />
//         </View>
//       )}
//       <CountDownTimer
//         timer={timer}
//         onTimeout={() => {
//           setTestOver(true);
//           handleSubmit();
//         }}
//       />
//     </View>
//   );
// };

// const calculatePercentage = (results) => {
//   const correctAnswers = results.filter(result => result === 'correct').length;
//   return (correctAnswers / results.length) * 100;
// };

// export default BigCashTrivia;





// Create Subscriber Profile API Call
// export const createSubscriberProfile = async (msisdn, nickname, avatarId) => {
//     try {
//       const token = localStorage.getItem("authToken"); // Ensure the token is available
//       if (!token) {
//         throw new Error("No auth token available");
//       }
  
//       const payload = {
//         msisdn,
//         nickname,
//         avatarId,
//       };
  
//       const response = await axios.post(`${BASE_URL}/CreateSubscriberProfile`, payload, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Pass the token in headers
//         },
//       });
  
//       return response.data;
//     } catch (error) {
//       console.error("Error creating subscriber profile:", error);
//       throw error;
//     }
//   };
  



//   import { createSubscriberProfile } from "../api/userApi";

// // ...

//   const handleCreateSubscriberProfile = async (msisdn, nickname, avatarId) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await createSubscriberProfile(msisdn, nickname, avatarId);
//       if (response.statusCode === "999") {
//         // Successfully created the profile, update the user state
//         setUserProfile(response.data);
//       } else {
//         setError(response.statusMessage);
//       }
//     } catch (error) {
//       console.error("Failed to create profile", error);
//       setError("Error creating profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Call `handleCreateSubscriberProfile` when a user subscribes or during the signup flow
//   useEffect(() => {
//     if (auth?.token && msisdn) {
//       // Create a profile after successful subscription
//       handleCreateSubscriberProfile(msisdn, "Racer001", 1); // You can customize the nickname/avatarId
//     }
//   }, [auth?.token, msisdn]);

//   Wherever the user subscribes in your app (e.g., after they enter a USSD code, click a subscription button, or get redirected to the app), you need to trigger the profile creation right after successful subscription.


// import { useContext } from "react";
// import axios from "axios";
// import AuthContext from "../Context/AuthContext";
// // import { useAuth } from '../Context/AuthContext'; 

// const BASE_URL = "https://ydvassdp.com:5001/api/YellowdotGames";


// // const useUserApi = () => {

//   const { auth, refreshAuthToken } = useContext(AuthContext);
//   // const { auth, setAuth } = useAuth();
//   export const createSubscriberProfile = async (msisdn, nickname, avatarId) => {
      

//   try {
//     await refreshAuthToken();
//         // const token = localStorage.getItem("authToken");
//         // if (!token) {
//         //   throw new Error("No auth token available");
//         // }
    
//         const payload = {
//           msisdn,
//           nickname,
//           avatarId,
//         };
    
//         const response = await axios.post(`${BASE_URL}/CreateSubscriberProfile`, payload, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${auth.token}`, 
//           },
//         });
    
//         return response.data;
//       } catch (error) {
//         console.error("Error creating subscriber profile:", error);
//         throw error;
//       }
//     };
    




//  export const getSubscriberProfile = async (auth, msisdn) => {
//   try {

//     if (typeof refreshAuthToken !== "function") {
//       throw new Error("refreshAuthToken is not a function");
//     }
//     // const token = auth?.token;
//     await refreshAuthToken();
//     console.log("Auth Token:", auth.token);
//     // const token = localStorage.getItem("authToken");

//     // if (!token) {
//     //   throw new Error("No auth token available");
//     // }
//     // console.log("Auth Token:", token);
//     // console.log("MSISDN:", msisdn);
//     const response = await axios.get(
//       `${BASE_URL}/GetSubscriberProfile?msisdn=${msisdn}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching subscriber profile:", error);
//     throw error;
//   }
// };


// export const updateSubscriberProfile = async (
//   auth,
//   msisdn,
//   nickname,
//   avatarId
// ) => {
//   // console.log('Updating profile with:', { msisdn, nickname, avatarId });

//   try {

//     await refreshAuthToken();
//     // const token = localStorage.getItem("authToken");
//     // // const token = auth?.token;
//     // if (!token) {
//     //   throw new Error("No auth token available");
//     // }
//     const payload = {
//       msisdn,
//       nickname,
//       avatarId,
//     };
//     const response = await axios.put(
//       `${BASE_URL}/UpdateSubscriberProfile`,
//       payload,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error updating leaderboard score:", error);
//     throw error;
//   }
// };

// // return {
// //   createSubscriberProfile,
// //   getSubscriberProfile,
// //   updateSubscriberProfile,
// // };
// // };

// //  default useUserApi;



// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// // import { useAuth } from '../Context/AuthContext'; 
// import { createSubscriberProfile, getSubscriberProfile, updateSubscriberProfile } from '../api/userApi'; 
// // import useUserApi from "../api/userApi";


// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [userProfile, setUserProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { auth } = useAuth(); 

//   const [msisdn, setMsisdn] = useState(() => {
//     const savedMsisdn = localStorage.getItem("cli");
//     return savedMsisdn || "";
//   });

//   // useEffect(() => {
//   //   if (auth?.token && msisdn) {
//   //     fetchProfile(msisdn);
//   //   }
//   // }, [auth?.token, msisdn]);

//   useEffect(() => {
//     localStorage.setItem("cli", msisdn);
//   }, [msisdn]);

// const handleCreateSubscriberProfile = useCallback(async (msisdn, nickname, avatarId) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await createSubscriberProfile(msisdn, nickname, avatarId);
//       if (response.statusCode === "999") {
//         setUserProfile(response.data);
//       } else {
//         setError(response.statusMessage);
//       }
//     } catch (error) {
//       console.error("Failed to create profile", error);
//       setError("Error creating profile");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//  const fetchProfile = useCallback(async (msisdn) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const profileData = await getSubscriberProfile( msisdn);
//       if (profileData.statusCode === "999") {
//         setUserProfile(profileData.data);
//       } else {
//         setError(profileData.statusMessage);
//       }
//     } catch (error) {
//       console.error("Failed to fetch profile", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [auth]);

//   const handleUpdateSubscriberProfile = useCallback(async (msisdn, nickname, avatarId) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await updateSubscriberProfile(auth, msisdn, nickname, avatarId || "");
//       if (response.statusCode === "999") {
//         setUserProfile((prev) => ({ ...prev, avatarID: avatarId }));
//       } else {
//         setError(response.statusMessage);
//       }
//     } catch (error) {
//       console.error("Failed to update profile", error);
//       setError("Error updating profile");
//     } finally {
//       setLoading(false);
//     }
//   }, [auth]);

//   return (
//     <UserContext.Provider value={{
//       userProfile,
//       loading,
//       error,
//       msisdn,
//       setMsisdn,
//       handleCreateSubscriberProfile,
//       fetchProfile,
//       handleUpdateSubscriberProfile,
//     }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserContext;
// export const useUserContext = () => useContext(UserContext);


// 



// const handleNextQuestion = useCallback( async () => {
//     setSelectedAnswer(null);
//     setTimer(10);

//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     } else {
//       await finalizeGame();
//     }
//   },  [currentQuestionIndex, questions.length, finalizeGame]);

// const handleTimerExpiration = useCallback (async () => {
//     if (selectedAnswer === null) {
//       console.log("Time's up! No answer was selected for the question.");
//       setStatuses((prevStatuses) => {
//         const newStatuses = [...prevStatuses];
//         newStatuses[currentQuestionIndex] = "incorrect";
//         return newStatuses;
//       });

//       await handleNextQuestion(false);
//     }
//   }, [selectedAnswer, currentQuestionIndex, handleNextQuestion])  

// const handleAnswerClick = useCallback( async (answer) => {
//     if (selectedAnswer) return;

//     setSelectedAnswer(answer);
//     const questionId = questions[currentQuestionIndex].id;
//     const response = await handleAnswerSubmit(msisdn, questionId, answer);
//     console.log("Submit answer response:", response);

//     const isAnswerCorrect =
//       answer === questions[currentQuestionIndex].rightAnswer;

//     setStatuses((prevStatuses) => {
//       const newStatuses = [...prevStatuses];
//       newStatuses[currentQuestionIndex] = isAnswerCorrect
//         ? "correct"
//         : "incorrect";
//       return newStatuses;
//     });

//     console.log("Updated statuses:", statuses);

//     setScore((prevScore) => {
//       let awardedPoints = 0;
//       if (response && response.statusCode === "999") {
//         const pointsMessage = response.message;
//         awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
//       }
//       return prevScore + awardedPoints;
//     });

//     setTimeout(() => {
//       handleNextQuestion();
//     }, 2000);
//   },
//   [selectedAnswer, currentQuestionIndex, questions, msisdn, handleAnswerSubmit, handleNextQuestion]
//   );




//   const finalizeGame = useCallback(async () => {
//     const finalScore = await new Promise((resolve) => {
//       setScore((prevScore) => {
//         resolve(prevScore);
//         return prevScore;
//       });
//     });

//     // console.log("All questions answered. Final Score:", finalScore, statuses);
//     console.log(statuses);
//     await handleUpdateLeaderboardScore(msisdn, finalScore);

//     setTimeout(() => {
//       navigate("/result-page", {
//         state: {
//           score: finalScore,
//           totalQuestions: questions.length,
//           statuses: statuses,
//         },
//       });
//     }, 2000);
//   }, [msisdn, statuses, questions.length, navigate, handleUpdateLeaderboardScore]);

// const handleNextQuestion = useCallback( async () => {
//     setSelectedAnswer(null);
//     setTimer(10);

//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     } else {
//       await finalizeGame();
//     }
//   },  [currentQuestionIndex, questions.length, finalizeGame]);

// const handleTimerExpiration = useCallback (async () => {
//     if (selectedAnswer === null) {
//       console.log("Time's up! No answer was selected for the question.");
//       setStatuses((prevStatuses) => {
//         const newStatuses = [...prevStatuses];
//         newStatuses[currentQuestionIndex] = "incorrect";
//         return newStatuses;
//       });

//       await handleNextQuestion(false);
//     }
//   }, [selectedAnswer, currentQuestionIndex, handleNextQuestion]);  

// const handleAnswerClick = useCallback( async (answer) => {
//     if (selectedAnswer) return;

//     setSelectedAnswer(answer);
//     const questionId = questions[currentQuestionIndex].id;
//     const response = await handleAnswerSubmit(msisdn, questionId, answer);
//     console.log("Submit answer response:", response);

//     const isAnswerCorrect =
//       answer === questions[currentQuestionIndex].rightAnswer;

//     setStatuses((prevStatuses) => {
//       const newStatuses = [...prevStatuses];
//       newStatuses[currentQuestionIndex] = isAnswerCorrect
//         ? "correct"
//         : "incorrect";
//       return newStatuses;
//     });

//     console.log("Updated statuses:", statuses);

//     setScore((prevScore) => {
//       let awardedPoints = 0;
//       if (response && response.statusCode === "999") {
//         const pointsMessage = response.message;
//         awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
//       }
//       return prevScore + awardedPoints;
//     });

//     setTimeout(() => {
//       handleNextQuestion();
//     }, 2000);
//   },
//   [selectedAnswer, currentQuestionIndex, questions, msisdn, handleAnswerSubmit, handleNextQuestion]);



  
  

// import { createContext, useState, useEffect, useContext } from 'react';
// import { getTriviaGames,getTriviaQuestions, submitAnswer } from '../api/triviaApi';
// import { TriviaAuthContext } from './TriviaAuthContext';

// export const TriviaContext = createContext();

// export const TriviaProvider = ({ children }) => {
//   const { authToken } = useContext(TriviaAuthContext);
//   const [games, setGames] = useState([]);
//   const [questions, setQuestions] = useState([]);
//   const [selectedGameId, setSelectedGameId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchGames = async () => {
//     setLoading(true);
//     try {
//       const response = await getTriviaGames(10);
//       const sortedGames = response.data.sort((a, b) => a.name.localeCompare(b.name));

//       setGames(sortedGames);
//     } catch (error) {
//         setError("Error fetching trivia games");
//       console.error('Error fetching games:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchQuestions = async (gameId) => {
//     if (questions.length > 0) {
//         // console.log(`Questions already fetched for gameId: ${gameId}`);
//         return;
//       }
//     // console.log(`Fetching questions for gameId: ${gameId}`);
//     setLoading(true);

//     try {

//         const response = await getTriviaQuestions(gameId);
//         // console.log("Fetched Questions:", response.data);
//         const structuredQuestions = response.data.map(question => ({
//             id: question.id,
//             text: question.text,
//             rightAnswer: question.rightAnswer,
//             answers: [question.rightAnswer, question.wrongAnswer]
//         }));
//         setQuestions(structuredQuestions);

//     } catch (error) {
//         setError("Error fetching trivia questions");

//       console.error('Error fetching questions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAnswerSubmit = async (msisdn, questionId, submittedAnswer) => {
//     try {
//       const data = await submitAnswer(msisdn, questionId, submittedAnswer);
//       return data;
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchGames();
//   }, []);

//   useEffect(() => {
//     if (selectedGameId) {
//       fetchQuestions(selectedGameId);
//     }
//   }, [selectedGameId]);

//   return (
//     <TriviaContext.Provider
//       value={{
//         games,
//         fetchGames,
//         questions,
//         selectedGameId,
//         setSelectedGameId,
//         fetchQuestions,
//         handleAnswerSubmit,
//         loading,
//         error
//       }}
//     >
//       {children}
//     </TriviaContext.Provider>
//   );
// };






// import React, { useState, useEffect, useContext, useCallback } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Timer from "../assets/Icons/timer.svg";
// import { LeaderboardContext } from "../Context/LeaderboardContext";
// import { TriviaContext } from "../Context/TriviaContext";
// import UserContext from "../Context/UserContext";
// import { Circles } from "react-loader-spinner";
// import { submitAnswer } from "../api/triviaApi";

// const BigCashTrivia = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [score, setScore] = useState(0);
//   const [statuses, setStatuses] = useState([]);
//   const [timer, setTimer] = useState(10);
//   const navigate = useNavigate();

//   const { msisdn } = useContext(UserContext);
//   const { gameId } = useParams();
//   const { handleUpdateLeaderboardScore } = useContext(LeaderboardContext);
//   const {
//     loading,
//     fetchQuestions,
//     questions,
//     selectedGameId,
//     handleAnswerSubmit,
//   } = useContext(TriviaContext);

//   useEffect(() => {
//     if (selectedGameId) {
//       fetchQuestions(selectedGameId);
//     }
//   }, [selectedGameId, fetchQuestions]);

//   useEffect(() => {
//     if (questions.length > 0) {
//       setCurrentQuestionIndex(0);
//       setSelectedAnswer(null);
//       setTimer(10);
//       setStatuses(Array(questions.length).fill(null));
//     }
//   }, [questions]);

//   useEffect(() => {
//     if (currentQuestionIndex >= questions.length) return;

//     const timerId = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerId);
//           handleTimerExpiration();
//           return 10; // Reset timer
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [currentQuestionIndex]);

//   const finalizeGame = useCallback(async () => {
//     const finalScore = score; // Directly use score state here
//     console.log(statuses);
//     await handleUpdateLeaderboardScore(msisdn, finalScore);

//     setTimeout(() => {
//       navigate("/result-page", {
//         state: {
//           score: finalScore,
//           totalQuestions: questions.length,
//           statuses: statuses,
//         },
//       });
//     }, 2000);
//   }, [msisdn, statuses, questions.length, navigate, handleUpdateLeaderboardScore, score]);

//   const handleNextQuestion = useCallback(async () => {
//     setSelectedAnswer(null);
//     setTimer(10);

//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     } else {
//       await finalizeGame();
//     }
//   }, [currentQuestionIndex, questions.length, finalizeGame]);

//   const handleTimerExpiration = useCallback(async () => {
//     if (selectedAnswer === null) {
//       console.log("Time's up! No answer was selected for the question.");
//       setStatuses((prevStatuses) => {
//         const newStatuses = [...prevStatuses];
//         newStatuses[currentQuestionIndex] = "incorrect";
//         return newStatuses;
//       });
//       await handleNextQuestion();
//     }
//   }, [selectedAnswer, currentQuestionIndex, handleNextQuestion]);

//   const handleAnswerClick = useCallback(async (answer) => {
//     if (selectedAnswer) return;

//     setSelectedAnswer(answer);
//     const questionId = questions[currentQuestionIndex].id;
//     const response = await handleAnswerSubmit(msisdn, questionId, answer);
//     console.log("Submit answer response:", response);

//     const isAnswerCorrect = answer === questions[currentQuestionIndex].rightAnswer;

//     setStatuses((prevStatuses) => {
//       const newStatuses = [...prevStatuses];
//       newStatuses[currentQuestionIndex] = isAnswerCorrect
//         ? "correct"
//         : "incorrect";
//       return newStatuses;
//     });

//     console.log("Updated statuses:", statuses);

//     setScore((prevScore) => {
//       let awardedPoints = 0;
//       if (response && response.statusCode === "999") {
//         const pointsMessage = response.message;
//         awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
//       }
//       return prevScore + awardedPoints;
//     });

//     setTimeout(() => {
//       handleNextQuestion();
//     }, 2000);
//   }, [selectedAnswer, currentQuestionIndex, questions, msisdn, handleAnswerSubmit, handleNextQuestion]);

//   if (loading || !questions || questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center mx-auto mt-[50px]">
//         <Circles color="black" height={50} width={50} />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen bg-darrk-gradient text-white">
//       <div className="mt-[60px] mb-[30px]">
//         <div className="flex items-center justify-center bg-white w-[46px] h-[46px] border rounded-[50px]">
//           <img className="img-timer" src={Timer} alt="timer" />
//           <p className="text-black text-[18px] font-mtn-brighter-medium font-medium text-center">
//             {timer}
//           </p>
//         </div>
//       </div>

//       <div className="p-4 text-center">
//         <h2 className="text-[24px] text-white leading-[24px] font-bold font-mtn-brighter-bold text-center mb-[47px]">
//           {questions[currentQuestionIndex]?.text || "No question available."}
//         </h2>

//         {/* Pagination Dots */}
//         <div className="flex items-center justify-center mt-4 mb-[59px] gap-[25px] px-4">
//           {questions.map((_, index) => (
//             <div
//               key={index}
//               className={`w-3 h-3 rounded-full ${
//                 statuses[index] === "correct"
//                   ? "bg-[#82e180]"
//                   : statuses[index] === "incorrect"
//                   ? "bg-[#e37e80]"
//                   : "bg-gray-500"
//               }`}
//             />
//           ))}
//         </div>

//         <div className="flex flex-col gap-[21px]">
//           {questions[currentQuestionIndex]?.answers?.map((answer, index) => (
//             <button
//               key={index}
//               onClick={() => handleAnswerClick(answer)}
//               className={`py-2 px-4 text-black rounded-[50px] w-[90vw] h-[60px] ${
//                 selectedAnswer === answer
//                   ? answer === questions[currentQuestionIndex].rightAnswer
//                     ? "bg-[#82e180]"
//                     : "bg-[#e37e80]"
//                   : selectedAnswer &&
//                     answer === questions[currentQuestionIndex].rightAnswer
//                   ? "bg-[#82e180]"
//                   : "bg-white"
//               }`}
//               disabled={selectedAnswer !== null}
//             >
//               {answer}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default React.memo(BigCashTrivia);







// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Timer from "../assets/Icons/timer.svg";
// import { LeaderboardContext } from "../Context/LeaderboardContext";
// import { TriviaContext } from "../Context/TriviaContext";
// import UserContext from "../Context/UserContext";
// import { Circles } from "react-loader-spinner";
// import { submitAnswer } from "../api/triviaApi";

// const BigCashTrivia = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState([]);
//   const [score, setScore] = useState(0);
//   const [statuses, setStatuses] = useState([]);
//   const [timer, setTimer] = useState(10);
//   const navigate = useNavigate();

//   const { msisdn } = useContext(UserContext);
//   const { gameId } = useParams();
//   const { handleUpdateLeaderboardScore } = useContext(LeaderboardContext);
//   const {
//     loading,
//     fetchQuestions,
//     questions,
//     selectedGameId,
//     handleAnswerSubmit,
//   } = useContext(TriviaContext);

//   useEffect(() => {
//     if (selectedGameId) {
//       fetchQuestions(selectedGameId);
//     }
//   }, [selectedGameId]);

//   useEffect(() => {
//     if (questions.length > 0) {
//       setCurrentQuestionIndex(0);
//       setSelectedAnswer(null);
//       setTimer(10);
//       setStatuses(Array(questions.length).fill(null));
//     }
//   }, [questions]);

//   useEffect(() => {
//     if (currentQuestionIndex >= questions.length) return;

//     const timerId = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerId);
//           handleTimerExpiration(null);
//           return 10;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [currentQuestionIndex]);

//   const handleTimerExpiration = async () => {
//     if (selectedAnswer === null) {
//       console.log("Time's up! No answer was selected for the question.");
//       setStatuses((prevStatuses) => {
//         const newStatuses = [...prevStatuses];
//         newStatuses[currentQuestionIndex] = "incorrect";
//         return newStatuses;
//       });

//       await handleNextQuestion(false);
//     }
//   };

//   const handleAnswerClick = async (answer) => {
//     if (selectedAnswer) return;

//     setSelectedAnswer(answer);
//     const questionId = questions[currentQuestionIndex].id;
//     const response = await handleAnswerSubmit(msisdn, questionId, answer);
//     console.log("Submit answer response:", response);

//     const isAnswerCorrect =
//       answer === questions[currentQuestionIndex].rightAnswer;

//     setStatuses((prevStatuses) => {
//       const newStatuses = [...prevStatuses];
//       newStatuses[currentQuestionIndex] = isAnswerCorrect
//         ? "correct"
//         : "incorrect";
//       return newStatuses;
//     });

//     console.log("Updated statuses:", statuses);

//     setScore((prevScore) => {
//       let awardedPoints = 0;
//       if (response && response.statusCode === "999") {
//         const pointsMessage = response.message;
//         awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
//       }
//       return prevScore + awardedPoints;
//     });

//     setTimeout(() => {
//       handleNextQuestion();
//     }, 2000);
//   };

//   const handleNextQuestion = async () => {
//     setSelectedAnswer(null);
//     setTimer(10);

//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     } else {
//       await finalizeGame();
//     }
//   };

//   const finalizeGame = async () => {
//     const finalScore = await new Promise((resolve) => {
//       setScore((prevScore) => {
//         resolve(prevScore);
//         return prevScore;
//       });
//     });

//     console.log(statuses);
//     await handleUpdateLeaderboardScore(msisdn, finalScore);

//     setTimeout(() => {
//       navigate("/result-page", {
//         state: {
//           score: finalScore,
//           totalQuestions: questions.length,
//           statuses: statuses,
//         },
//       });
//     }, 2000);
//   };

//   if (loading || !questions || questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center mx-auto mt-[50px]">
//         <Circles color="black" height={50} width={50} />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen bg-darrk-gradient text-white">
//       <div className="mt-[60px] mb-[30px]">
//         <div className="flex items-center justify-center bg-white w-[46px] h-[46px] border rounded-[50px]">
//           <img className="img-timer" src={Timer} alt="timer" />
//           <p className="text-black text-[18px] font-mtn-brighter-medium font-medium text-center">
//             {timer}
//           </p>
//         </div>
//       </div>

//       <div className="p-4 text-center">
//         <h2 className="text-[24px] text-white leading-[24px] font-bold font-mtn-brighter-bold text-center mb-[47px]">
//           {questions[currentQuestionIndex]?.text || "No question available."}
//         </h2>

//         {/* Pagination Dots */}
//         <div className="flex items-center justify-center mt-4 mb-[59px] gap-[25px] px-4">
//           {questions.map((_, index) => (
//             <div
//               key={index}
//               className={`w-3 h-3 rounded-full ${
//                 statuses[index] === "correct"
//                   ? "bg-[#82e180]"
//                   : statuses[index] === "incorrect"
//                   ? "bg-[#e37e80]"
//                   : "bg-gray-500"
//               }`}
//             />
//           ))}
//         </div>

//         <div className="flex flex-col gap-[21px]">
//           {questions[currentQuestionIndex]?.answers?.map((answer, index) => (
//             <button
//               key={index}
//               onClick={() => handleAnswerClick(answer)}
//               className={`py-2 px-4 text-black rounded-[50px] w-[90vw] h-[60px] ${
//                 selectedAnswer === answer
//                   ? answer === questions[currentQuestionIndex].rightAnswer
//                     ? "bg-[#82e180]"
//                     : "bg-[#e37e80]"
//                   : selectedAnswer &&
//                     answer === questions[currentQuestionIndex].rightAnswer
//                   ? "bg-[#82e180]"
//                   : "bg-white"
//               }`}
//               disabled={selectedAnswer !== null}
//             >
//               {answer}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default React.memo(BigCashTrivia);








// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Timer from "../assets/Icons/timer.svg";
// import { LeaderboardContext } from "../Context/LeaderboardContext";
// import { TriviaContext } from "../Context/TriviaContext";
// import UserContext from "../Context/UserContext";
// import { Circles } from "react-loader-spinner";

// const BigCashTrivia = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [score, setScore] = useState(0);
//   const [statuses, setStatuses] = useState([]);
//   const [timer, setTimer] = useState(10);
//   const navigate = useNavigate();

//   const { msisdn } = useContext(UserContext);
//   const { gameId } = useParams();
//   const { handleUpdateLeaderboardScore } = useContext(LeaderboardContext);
//   const { loading, fetchQuestions, questions, selectedGameId, handleAnswerSubmit } = useContext(TriviaContext);

//   useEffect(() => {
//     if (selectedGameId) {
//       fetchQuestions(selectedGameId);
//     }
//   }, [selectedGameId]);

//   useEffect(() => {
//     if (questions.length > 0) {
//       setCurrentQuestionIndex(0);
//       setSelectedAnswer(null);
//       setTimer(10);
//       setStatuses(Array(questions.length).fill(null));
//     }
//   }, [questions]);

//   useEffect(() => {
//     const timerId = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerId);
//           handleNextQuestion(false); 
//           return 10; 
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [currentQuestionIndex]);

//   const handleAnswerClick = async (answer) => {
//     if (selectedAnswer) return; 

//     setSelectedAnswer(answer);
//     const questionId = questions[currentQuestionIndex].id;
//     const response = await handleAnswerSubmit(msisdn, questionId, answer);
//     console.log("Submit answer response:", response);

//     const isAnswerCorrect = answer === questions[currentQuestionIndex]?.rightAnswer;
    
//     setStatuses((prevStatuses) => {
//       const newStatuses = [...prevStatuses];
//       newStatuses[currentQuestionIndex] = isAnswerCorrect ? "correct" : "incorrect";
//       console.log("Updated statuses:", newStatuses);
//       return newStatuses;
//     });

//     if (response && response.statusCode === "999") {
//       const pointsMessage = response.message;
//       const awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
//       console.log(`Awarded Points: ${awardedPoints}`);
//       setScore((prevScore) => prevScore + awardedPoints);
//     } else {
//       console.error("Failed to submit answer:", response);
//     }

//     setTimeout(() => {
//       handleNextQuestion(isAnswerCorrect);
//     }, 2000);
//   };

//   const handleNextQuestion = (answeredCorrectly) => {
//     setSelectedAnswer(null);
//     setTimer(10); 

//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     } else {
//       console.log("All questions answered. Final Score:", score);
//       handleUpdateLeaderboardScore(msisdn, score);

//       setTimeout(() => {
//         navigate("/result-page", {
//           state: {
//             score: score,
//             totalQuestions: questions.length,
//             statuses: [...statuses],
//           },
//         });
//       }, 2000);
//     }
//   };

//   if (loading || !questions || questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center mx-auto mt-[50px]">
//         <Circles color="black" height={50} width={50} />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen bg-darrk-gradient text-white">
//       <div className="mt-[60px] mb-[30px]">
//         <div className="flex items-center justify-center bg-white w-[46px] h-[46px] border rounded-[50px]">
//           <img className="img-timer" src={Timer} alt="timer" />
//           <p className="text-black text-[18px] font-mtn-brighter-medium font-medium text-center">
//             {timer}
//           </p>
//         </div>
//       </div>

//       <div className="p-4 text-center">
//         <h2 className="text-[24px] text-white leading-[24px] font-bold font-mtn-brighter-bold text-center mb-[47px]">
//           {questions[currentQuestionIndex]?.text || "No question available."}
//         </h2>

//         {/* Pagination Dots */}
//         <div className="flex items-center justify-center mt-4 mb-[59px] gap-[25px] px-4">
//           {questions.map((_, index) => (
//             <div
//               key={index}
//               className={`w-3 h-3 rounded-full ${
//                 statuses[index] === "correct"
//                   ? "bg-[#82e180]"
//                   : statuses[index] === "incorrect"
//                   ? "bg-[#e37e80]"
//                   : "bg-gray-500"
//               }`}
//             />
//           ))}
//         </div>

//         <div className="flex flex-col gap-[21px]">
//           {questions[currentQuestionIndex].answers.map((answer, index) => (
//             <button
//               key={index}
//               onClick={() => handleAnswerClick(answer)}
//               className={`py-2 px-4 text-black rounded-[50px] w-[90vw] h-[60px] ${
//                 selectedAnswer === answer
//                   ? answer === questions[currentQuestionIndex].rightAnswer
//                     ? "bg-[#82e180]"
//                     : "bg-[#e37e80]"
//                   : selectedAnswer &&
//                     answer === questions[currentQuestionIndex].rightAnswer
//                   ? "bg-[#82e180]"
//                   : "bg-white"
//               }`}
//               disabled={selectedAnswer !== null}
//             >
//               {answer}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default React.memo(BigCashTrivia);






  
// import { useEffect, useRef } from "react";
// import { checkSubscriptionStatus } from "../api/subscription"; // Your API service

// const useSubscriptionChecker = (msisdn, interval = 60000) => { // Check every 60 seconds
//   const timerRef = useRef();

//   useEffect(() => {
//     if (!msisdn) return;

//     const checkStatus = async () => {
//       const status = await checkSubscriptionStatus(msisdn);
//       if (!status.isActive) {
//         // Handle expired subscription
//         alert("Your subscription has expired. Please renew to continue.");
//         window.location.href = "/subscribe"; // Redirect to subscription page
//       }
//     };

//     // Start polling
//     timerRef.current = setInterval(checkStatus, interval);

//     return () => clearInterval(timerRef.current); // Cleanup on unmount
//   }, [msisdn, interval]);
// };

// export default useSubscriptionChecker;





// import React, { useEffect, useContext } from "react";
// import { checkSubscriptionStatus } from "./api/subscription"; // API call
// import { AuthContext } from "./Context/AuthContext"; // Context managing msisdn
// import { useNavigate } from "react-router-dom";

// const App = () => {
//   const { msisdn } = useContext(AuthContext); // Fetch msisdn from context
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!msisdn) return;

//     const interval = setInterval(async () => {
//       try {
//         const response = await checkSubscriptionStatus(msisdn);

//         if (!response.isActive) {
//           alert("Your subscription has expired. Please renew to continue.");
//           navigate("/subscribe"); // Redirect user to subscription page
//         }
//       } catch (error) {
//         console.error("Failed to check subscription status:", error);
//       }
//     }, 60000); // Check every minute

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, [msisdn, navigate]);

//   return (
//     <div>
//       {/* Your routing and components */}
//     </div>
//   );
// };

// export default App;







// import React, { useContext } from "react";
// import { SubscriptionContext } from "../Context/SubscriptionContext";

// const PremiumContent = () => {
//   const { isSubscribed, verifySubscription } = useContext(SubscriptionContext);

//   const handlePlayGame = async () => {
//     await verifySubscription();
//     if (!isSubscribed) {
//       alert("Your subscription has expired. Please renew to continue.");
//       return;
//     }

//     // Proceed with the game
//   };

//   return <button onClick={handlePlayGame}>Play Game</button>;
// };




// import React, { createContext, useState } from "react";
// import axios from "axios";

// export const SubscriptionContext = createContext();

// export const SubscriptionProvider = ({ children }) => {
//   const [isSubscribed, setIsSubscribed] = useState(null); // null indicates no check yet
//   const [loading, setLoading] = useState(false);

//   const verifySubscription = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("/api/check-subscription");
//       setIsSubscribed(response.data.isSubscribed); // Adjust this based on API response
//     } catch (error) {
//       console.error("Subscription check failed", error);
//       setIsSubscribed(false); // Assume not subscribed if the check fails
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SubscriptionContext.Provider value={{ isSubscribed, verifySubscription, loading }}>
//       {children}
//     </SubscriptionContext.Provider>
//   );
// };

















