wipe
model BasicBuilder -ndm 3 -ndf 6
node 1 0 0 0 
node 2 0 0 0
fix 1 1 1 1 1 1 1
fix 2 0 1 1 1 0 0
uniaxialMaterial Steel01 1 319.3 210000 0.1    
uniaxialMaterial Concrete01 2 28 0.002 35 0.0035
section Fiber 1 -GJ 100000000 {
fiber 81 35 314.159265358979 1
fiber 127 35 314.159265358979 1
fiber 173 35 314.159265358979 1
fiber 219 35 314.159265358979 1
fiber 265 35 314.159265358979 1
fiber 265 81 314.159265358979 1
fiber 265 127 314.159265358979 1
fiber 265 173 314.159265358979 1
fiber 265 219 314.159265358979 1
fiber 265 265 314.159265358979 1
fiber 219 265 314.159265358979 1
fiber 173 265 314.159265358979 1
fiber 127 265 314.159265358979 1
fiber 80.9999999999999 265 314.159265358979 1
fiber 34.9999999999999 265 314.159265358979 1
fiber 35 219 314.159265358979 1
fiber 35 173 314.159265358979 1
fiber 35 127 314.159265358979 1
fiber 35 81 314.159265358979 1
fiber 35 35 314.159265358979 1
fiber 10.714287439982 10.7142836252849 459.183685147014 2
fiber 10.7142839431763 289.285705884298 459.183971249266 2
fiber 289.28571351369 10.7142922083546 459.183889505861 2
fiber 289.285720825195 289.285720825195 459.183112942614 2
fiber 289.285720825195 267.857147216797 459.183766890317 2
fiber 289.285718282066 246.428565979002 459.183439916465 2
fiber 289.285722096762 225.000003814699 459.182949455688 2
fiber 289.285720825195 203.571449279785 459.183112942614 2
fiber 289.28572209676 182.142879486084 459.183603403391 2
fiber 289.285710652669 160.714299519857 459.183766890317 2
fiber 289.28570810954 139.285728454592 459.184093864635 2
fiber 289.285704930623 117.857152938843 459.184175608214 2
fiber 289.28570620219 96.4285793304444 459.184012121055 2
fiber 289.285705566406 75.0000076293945 459.184093864635 2
fiber 289.285704930623 53.5714359283446 459.184012121055 2
fiber 289.285705884298 32.1428651809693 459.184052992845 2
fiber 267.857116381327 32.1428613662719 459.184052992845 2
fiber 267.857116699219 53.5714340209961 459.184093864635 2
fiber 246.42854309082 53.5714340209961 459.183439916465 2
fiber 267.857116699219 75.0000076293945 459.184093864635 2
fiber 246.428543726603 96.4285755157472 459.183194686077 2
fiber 224.999985376993 75.000005722046 459.183358173002 2
fiber 246.42854309082 75.0000076293945 459.183439916465 2
fiber 224.999984105428 96.4285717010497 459.183194686077 2
fiber 203.571418126422 96.428570429483 459.183685147087 2
fiber 224.999984741211 117.857139587402 459.183439916465 2
fiber 203.571418762205 117.857137044271 459.18376689055 2
fiber 182.142846425376 117.857138315835 459.183603403391 2
fiber 182.142851511637 139.285709381103 459.184257351793 2
fiber 160.714279174805 139.285705566406 459.183766890317 2
fiber 182.14285405477 160.714282989502 459.183930377476 2
fiber 160.714279174805 160.714279174805 459.183112942614 2
fiber 139.285720825195 160.714279174805 459.183112942614 2
fiber 160.714279174805 182.142852783203 459.183766890317 2
fiber 139.285717010498 182.14285405477 459.183930377476 2
fiber 117.857145945233 182.142843882246 459.183930377709 2
fiber 139.285709381103 203.571427663166 459.183603403391 2
fiber 117.857133229576 203.571417490638 459.183603403624 2
fiber 96.4285685221354 203.571418762205 459.18376689055 2
fiber 117.857131958008 224.999984741211 459.183112942614 2
fiber 96.4285659790039 224.999984741211 459.183439916465 2
fiber 74.9999923706055 246.42854309082 459.183439916465 2
fiber 53.5714225769043 246.42854309082 459.18327642954 2
fiber 74.9999949137334 267.857124328615 459.184420838719 2
fiber 53.57142162323 267.857117017111 459.183971249266 2
fiber 32.1428518295288 267.857116381327 459.184052992845 2
fiber 53.57142162323 289.285705248514 459.183971249266 2
fiber 32.1428527832031 289.285705566406 459.184012121055 2
fiber 74.999989827474 289.285713195799 459.18376689055 2
fiber 96.4285621643071 289.285722096761 459.18327642954 2
fiber 117.85712814331 289.28571955363 459.18327642954 2
fiber 139.285697937012 289.285720825195 459.183439916465 2
fiber 160.71427154541 289.285720825195 459.183439916465 2
fiber 182.14284515381 289.285723368325 459.183439916465 2
fiber 203.571418762205 289.285718282066 459.183439916465 2
fiber 225.000000000007 289.285725911451 459.183766890317 2
fiber 246.428573608391 289.285715738932 459.183112942614 2
fiber 267.857147216797 289.285720825195 459.183766890317 2
fiber 246.428558349609 267.857147216797 459.184420838952 2
fiber 267.857147216797 267.857147216797 459.184420838952 2
fiber 246.428558349609 246.428558349609 459.184420838952 2
fiber 267.857147216797 246.428558349609 459.184420838952 2
fiber 246.428558349609 224.999992370605 459.183439916 2
fiber 267.857147216797 224.999992370605 459.183439916 2
fiber 246.428558349609 203.571434020996 459.184093864635 2
fiber 267.85714594523 203.571437835693 459.183930377476 2
fiber 246.428557078042 182.142864227294 459.183930377476 2
fiber 267.857148488364 182.14287185669 459.183930377476 2
fiber 246.428551991781 160.714293162028 459.183930377476 2
fiber 267.857131958008 160.714294433594 459.184420838952 2
fiber 246.428541819255 139.285717010498 459.18327642954 2
fiber 267.857116699219 139.285720825195 459.183766890317 2
fiber 246.428543726603 117.857145309449 459.183521659928 2
fiber 267.857116699219 117.857151031494 459.184257351793 2
fiber 224.999984741211 139.285713195801 459.183439916465 2
fiber 224.999984741211 160.714286804199 459.183439916465 2
fiber 203.571426391602 160.714286804199 459.183439916465 2
fiber 224.999984741211 182.142860412598 459.183439916465 2
fiber 203.571426391602 182.142860412598 459.183439916465 2
fiber 182.142851511637 182.1428565979 459.184257351793 2
fiber 203.571427663167 203.571430206299 459.18327642954 2
fiber 182.142852783203 203.571426391602 459.183766890317 2
fiber 182.142852783203 224.999984741211 459.183766890317 2
fiber 160.714275360107 224.999986012776 459.18327642954 2
fiber 139.285701751709 224.999983469647 459.183603403391 2
fiber 160.71427154541 246.42854309082 459.183439916465 2
fiber 139.285697937012 246.42854309082 459.183439916465 2
fiber 117.85712814331 246.428544362386 459.18327642954 2
fiber 139.285697937012 267.857131958008 459.184747812804 2
fiber 117.857124328613 267.857131958008 459.184747812804 2
fiber 96.4285621643071 246.428541819255 459.18327642954 2
fiber 96.4285583496094 267.857131958008 459.184420838021 2
fiber 160.71427154541 267.857131958008 459.184747812804 2
fiber 182.142855326336 246.428550720217 459.184093864635 2
fiber 182.142842610684 267.857137044264 459.184420838952 2
fiber 203.571426391602 246.428558349609 459.183766890317 2
fiber 203.571418762205 267.85714975993 459.184093864635 2
fiber 224.999984741211 246.428558349609 459.183766890317 2
fiber 224.999984741211 267.857147216797 459.183766890317 2
fiber 203.571425120035 224.999988555908 459.182949455688 2
fiber 224.999984741211 224.999992370605 459.182785968762 2
fiber 224.999984741211 203.571434020996 459.183439916465 2
fiber 203.571426391602 139.285713195801 459.183439916465 2
fiber 10.7142834663391 246.428542931875 459.183296865405 2
fiber 32.1428532600403 246.428543249766 459.1834194806 2
fiber 10.714282989502 267.857116699219 459.183930377476 2
fiber 10.7142869631443 224.999976952869 459.183664711134 2
fiber 32.1428516705833 224.99997727076 459.183705582924 2
fiber 32.1428572336828 203.57140350342 459.183685147029 2
fiber 53.5714238484714 203.571417490639 459.183766890666 2
fiber 53.5714225769043 224.999984741211 459.18327642954 2
fiber 74.9999961853023 203.571427663167 459.18327642954 2
fiber 74.9999923706055 224.999984741211 459.183439916465 2
fiber 53.5714308420818 182.142845789593 459.183848634013 2
fiber 74.9999980926513 182.142852147419 459.183848633897 2
fiber 74.9999930063882 160.714274724324 459.183521659987 2
fiber 96.4285659790039 160.714279174805 459.183439916465 2
fiber 96.4285634358724 182.14284515381 459.18376689055 2
fiber 96.4285678863524 139.28570620219 459.184012121055 2
fiber 117.8571434021 139.285706837972 459.184257351793 2
fiber 117.857147216797 160.714279174805 459.183766890317 2
fiber 139.285713195801 117.857131958008 459.183439916465 2
fiber 139.285717010498 139.285704294839 459.183930377476 2
fiber 139.285717010498 96.4285672505701 459.183603403508 2
fiber 160.714279174805 96.4285659790039 459.183439916465 2
fiber 160.714279174805 117.857131958008 459.183112942614 2
fiber 160.71428235372 74.9999930063878 459.183521660045 2
fiber 182.142855962116 74.9999993642157 459.183685146971 2
fiber 182.14284515381 96.4285634358724 459.18376689055 2
fiber 182.142860412598 53.5714302062988 459.18376689055 2
fiber 203.571426391602 53.5714340209961 459.183439916465 2
fiber 203.571427027384 75.0000019073488 459.183194686077 2
fiber 203.571430206299 32.1428591410315 459.183603403508 2
fiber 224.999988714853 32.1428612073277 459.183296865274 2
fiber 224.999984741211 53.5714340209961 459.183439916465 2
fiber 225.000011285153 10.7142825126633 459.183582967598 2
fiber 246.428566137944 10.7142888704974 459.183092506573 2
fiber 246.428542931875 32.1428599357605 459.183460352331 2
fiber 267.857132275899 10.714287757874 459.184134736483 2
fiber 203.571445465087 10.7142880757654 459.183603403508 2
fiber 182.142872174582 10.7142845789601 459.183889505861 2
fiber 160.714298407235 10.7142856915795 459.183501224165 2
fiber 139.285728295646 10.7142818768824 459.183664711134 2
fiber 117.857152938843 10.7142855326332 459.183766890535 2
fiber 96.4285794893902 10.7142837842306 459.183582967649 2
fiber 75.0000074704488 10.7142844200134 459.183664711149 2
fiber 53.5714340209961 10.7142848968506 459.183685147029 2
fiber 32.1428616841634 10.7142842610677 459.183603403522 2
fiber 53.5714340209961 32.1428546905518 459.183685147029 2
fiber 32.1428604125976 32.1428527832031 459.183685147029 2
fiber 10.7142868041992 32.1428527832031 459.183685147029 2
fiber 32.1428600947061 53.57142162323 459.183644275268 2
fiber 10.7142871220907 53.57142162323 459.183644275268 2
fiber 10.7142863273621 74.9999922116598 459.18374645467 2
fiber 10.714285055796 96.4285623232528 459.183582967642 2
fiber 10.7142875989282 117.857127984364 459.183582967627 2
fiber 10.7142841021217 139.285693963369 459.183542095881 2
fiber 10.7142861684157 160.714267730712 459.183848634042 2
fiber 10.7142848968506 182.142837524414 459.183358173002 2
fiber 10.7142823537195 203.57140350342 459.183685147029 2
fiber 32.1428546905518 160.714263916016 459.184012121055 2
fiber 32.1428546905518 182.142837524414 459.183358173002 2
fiber 32.1428561210633 139.285690148672 459.183378608868 2
fiber 53.5714267094933 139.285693804424 459.183480788313 2
fiber 53.5714232126877 160.714268366496 459.183848634013 2
fiber 53.571428934733 117.857127507527 459.183603403537 2
fiber 75.0000038146973 117.857131958008 459.183439916465 2
fiber 74.999997456868 139.28570175171 459.183930377651 2
fiber 75.0000038146973 96.4285659790039 459.18376689055 2
fiber 96.4285736083985 96.4285647074377 459.183603403508 2
fiber 96.4285717010497 117.857132593791 459.183194686077 2
fiber 117.857145309449 96.4285653432212 459.183848634071 2
fiber 117.857139587402 117.857131958008 459.183439916465 2
fiber 96.4285736083984 74.9999923706055 459.18376689055 2
fiber 117.857147216797 74.9999936421712 459.18376689055 2
fiber 117.857145309449 53.5714206695567 459.183685147 2
fiber 139.285717010498 53.57142384847 459.183439916524 2
fiber 139.285717010498 74.9999910990393 459.183603403508 2
fiber 139.285720984141 32.1428542137146 459.183378608868 2
fiber 160.714286645254 32.1428542137146 459.183705582909 2
fiber 160.714287439982 53.571424484253 459.183685147029 2
fiber 117.857149124145 32.1428553263342 459.183930377549 2
fiber 96.4285753568016 32.1428535779314 459.183460352382 2
fiber 96.4285736083984 53.57142384847 459.183439916524 2
fiber 75.0000077883403 32.1428542137146 459.183705582909 2
fiber 75.000005722046 53.5714219411215 459.183521660016 2
fiber 53.5714340209961 53.5714225769043 459.183603403508 2
fiber 75.0000019073485 74.9999930063885 459.183685147029 2
fiber 53.5714311599732 74.999992052714 459.183726018789 2
fiber 32.1428589820862 74.9999922116598 459.18374645467 2
fiber 53.5714314778649 96.4285628000895 459.183603403479 2
fiber 32.1428580284119 96.4285581906638 459.183378608868 2
fiber 32.1428580284119 117.857124487559 459.183705582909 2
fiber 182.142860730489 32.1428575515748 459.183726018789 2
fiber 160.714279174805 203.571426391602 459.183112942614 2
fiber 267.857116699219 96.4285774230957 459.183930377476 2
}
element zeroLengthSection 1 1 2 1
pattern Plain 1 "Constant" {
	load 2 -10 0 0 0 0 0}
integrator LoadControl 0
system BandGeneral
test NormUnbalance 1e-10 1000
numberer RCM
constraints Plain
algorithm Newton
analysis Static
analyze 1
loadConst -time 0.0
recorder Element -file FiberResults/MKsectionForce.out -ele 1 section force
recorder Element -file FiberResults/MKsectionDef.out -ele 1 section deformation
recorder Element -file FiberResults/MKsectionStressFiber_0.out -ele 1 section fiber 81 35 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_1.out -ele 1 section fiber 127 35 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_2.out -ele 1 section fiber 173 35 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_3.out -ele 1 section fiber 219 35 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_4.out -ele 1 section fiber 265 35 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_5.out -ele 1 section fiber 265 81 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_6.out -ele 1 section fiber 265 127 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_7.out -ele 1 section fiber 265 173 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_8.out -ele 1 section fiber 265 219 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_9.out -ele 1 section fiber 265 265 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_10.out -ele 1 section fiber 219 265 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_11.out -ele 1 section fiber 173 265 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_12.out -ele 1 section fiber 127 265 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_13.out -ele 1 section fiber 80.9999999999999 265 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_14.out -ele 1 section fiber 34.9999999999999 265 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_15.out -ele 1 section fiber 35 219 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_16.out -ele 1 section fiber 35 173 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_17.out -ele 1 section fiber 35 127 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_18.out -ele 1 section fiber 35 81 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_19.out -ele 1 section fiber 35 35 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_20.out -ele 1 section fiber 10.714287439982 10.7142836252849 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_21.out -ele 1 section fiber 10.7142839431763 289.285705884298 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_22.out -ele 1 section fiber 289.28571351369 10.7142922083546 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_23.out -ele 1 section fiber 289.285720825195 289.285720825195 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_24.out -ele 1 section fiber 289.285720825195 267.857147216797 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_25.out -ele 1 section fiber 289.285718282066 246.428565979002 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_26.out -ele 1 section fiber 289.285722096762 225.000003814699 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_27.out -ele 1 section fiber 289.285720825195 203.571449279785 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_28.out -ele 1 section fiber 289.28572209676 182.142879486084 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_29.out -ele 1 section fiber 289.285710652669 160.714299519857 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_30.out -ele 1 section fiber 289.28570810954 139.285728454592 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_31.out -ele 1 section fiber 289.285704930623 117.857152938843 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_32.out -ele 1 section fiber 289.28570620219 96.4285793304444 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_33.out -ele 1 section fiber 289.285705566406 75.0000076293945 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_34.out -ele 1 section fiber 289.285704930623 53.5714359283446 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_35.out -ele 1 section fiber 289.285705884298 32.1428651809693 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_36.out -ele 1 section fiber 267.857116381327 32.1428613662719 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_37.out -ele 1 section fiber 267.857116699219 53.5714340209961 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_38.out -ele 1 section fiber 246.42854309082 53.5714340209961 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_39.out -ele 1 section fiber 267.857116699219 75.0000076293945 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_40.out -ele 1 section fiber 246.428543726603 96.4285755157472 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_41.out -ele 1 section fiber 224.999985376993 75.000005722046 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_42.out -ele 1 section fiber 246.42854309082 75.0000076293945 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_43.out -ele 1 section fiber 224.999984105428 96.4285717010497 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_44.out -ele 1 section fiber 203.571418126422 96.428570429483 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_45.out -ele 1 section fiber 224.999984741211 117.857139587402 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_46.out -ele 1 section fiber 203.571418762205 117.857137044271 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_47.out -ele 1 section fiber 182.142846425376 117.857138315835 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_48.out -ele 1 section fiber 182.142851511637 139.285709381103 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_49.out -ele 1 section fiber 160.714279174805 139.285705566406 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_50.out -ele 1 section fiber 182.14285405477 160.714282989502 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_51.out -ele 1 section fiber 160.714279174805 160.714279174805 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_52.out -ele 1 section fiber 139.285720825195 160.714279174805 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_53.out -ele 1 section fiber 160.714279174805 182.142852783203 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_54.out -ele 1 section fiber 139.285717010498 182.14285405477 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_55.out -ele 1 section fiber 117.857145945233 182.142843882246 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_56.out -ele 1 section fiber 139.285709381103 203.571427663166 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_57.out -ele 1 section fiber 117.857133229576 203.571417490638 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_58.out -ele 1 section fiber 96.4285685221354 203.571418762205 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_59.out -ele 1 section fiber 117.857131958008 224.999984741211 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_60.out -ele 1 section fiber 96.4285659790039 224.999984741211 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_61.out -ele 1 section fiber 74.9999923706055 246.42854309082 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_62.out -ele 1 section fiber 53.5714225769043 246.42854309082 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_63.out -ele 1 section fiber 74.9999949137334 267.857124328615 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_64.out -ele 1 section fiber 53.57142162323 267.857117017111 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_65.out -ele 1 section fiber 32.1428518295288 267.857116381327 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_66.out -ele 1 section fiber 53.57142162323 289.285705248514 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_67.out -ele 1 section fiber 32.1428527832031 289.285705566406 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_68.out -ele 1 section fiber 74.999989827474 289.285713195799 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_69.out -ele 1 section fiber 96.4285621643071 289.285722096761 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_70.out -ele 1 section fiber 117.85712814331 289.28571955363 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_71.out -ele 1 section fiber 139.285697937012 289.285720825195 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_72.out -ele 1 section fiber 160.71427154541 289.285720825195 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_73.out -ele 1 section fiber 182.14284515381 289.285723368325 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_74.out -ele 1 section fiber 203.571418762205 289.285718282066 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_75.out -ele 1 section fiber 225.000000000007 289.285725911451 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_76.out -ele 1 section fiber 246.428573608391 289.285715738932 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_77.out -ele 1 section fiber 267.857147216797 289.285720825195 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_78.out -ele 1 section fiber 246.428558349609 267.857147216797 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_79.out -ele 1 section fiber 267.857147216797 267.857147216797 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_80.out -ele 1 section fiber 246.428558349609 246.428558349609 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_81.out -ele 1 section fiber 267.857147216797 246.428558349609 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_82.out -ele 1 section fiber 246.428558349609 224.999992370605 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_83.out -ele 1 section fiber 267.857147216797 224.999992370605 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_84.out -ele 1 section fiber 246.428558349609 203.571434020996 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_85.out -ele 1 section fiber 267.85714594523 203.571437835693 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_86.out -ele 1 section fiber 246.428557078042 182.142864227294 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_87.out -ele 1 section fiber 267.857148488364 182.14287185669 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_88.out -ele 1 section fiber 246.428551991781 160.714293162028 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_89.out -ele 1 section fiber 267.857131958008 160.714294433594 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_90.out -ele 1 section fiber 246.428541819255 139.285717010498 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_91.out -ele 1 section fiber 267.857116699219 139.285720825195 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_92.out -ele 1 section fiber 246.428543726603 117.857145309449 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_93.out -ele 1 section fiber 267.857116699219 117.857151031494 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_94.out -ele 1 section fiber 224.999984741211 139.285713195801 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_95.out -ele 1 section fiber 224.999984741211 160.714286804199 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_96.out -ele 1 section fiber 203.571426391602 160.714286804199 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_97.out -ele 1 section fiber 224.999984741211 182.142860412598 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_98.out -ele 1 section fiber 203.571426391602 182.142860412598 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_99.out -ele 1 section fiber 182.142851511637 182.1428565979 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_100.out -ele 1 section fiber 203.571427663167 203.571430206299 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_101.out -ele 1 section fiber 182.142852783203 203.571426391602 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_102.out -ele 1 section fiber 182.142852783203 224.999984741211 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_103.out -ele 1 section fiber 160.714275360107 224.999986012776 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_104.out -ele 1 section fiber 139.285701751709 224.999983469647 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_105.out -ele 1 section fiber 160.71427154541 246.42854309082 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_106.out -ele 1 section fiber 139.285697937012 246.42854309082 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_107.out -ele 1 section fiber 117.85712814331 246.428544362386 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_108.out -ele 1 section fiber 139.285697937012 267.857131958008 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_109.out -ele 1 section fiber 117.857124328613 267.857131958008 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_110.out -ele 1 section fiber 96.4285621643071 246.428541819255 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_111.out -ele 1 section fiber 96.4285583496094 267.857131958008 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_112.out -ele 1 section fiber 160.71427154541 267.857131958008 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_113.out -ele 1 section fiber 182.142855326336 246.428550720217 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_114.out -ele 1 section fiber 182.142842610684 267.857137044264 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_115.out -ele 1 section fiber 203.571426391602 246.428558349609 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_116.out -ele 1 section fiber 203.571418762205 267.85714975993 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_117.out -ele 1 section fiber 224.999984741211 246.428558349609 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_118.out -ele 1 section fiber 224.999984741211 267.857147216797 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_119.out -ele 1 section fiber 203.571425120035 224.999988555908 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_120.out -ele 1 section fiber 224.999984741211 224.999992370605 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_121.out -ele 1 section fiber 224.999984741211 203.571434020996 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_122.out -ele 1 section fiber 203.571426391602 139.285713195801 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_123.out -ele 1 section fiber 10.7142834663391 246.428542931875 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_124.out -ele 1 section fiber 32.1428532600403 246.428543249766 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_125.out -ele 1 section fiber 10.714282989502 267.857116699219 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_126.out -ele 1 section fiber 10.7142869631443 224.999976952869 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_127.out -ele 1 section fiber 32.1428516705833 224.99997727076 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_128.out -ele 1 section fiber 32.1428572336828 203.57140350342 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_129.out -ele 1 section fiber 53.5714238484714 203.571417490639 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_130.out -ele 1 section fiber 53.5714225769043 224.999984741211 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_131.out -ele 1 section fiber 74.9999961853023 203.571427663167 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_132.out -ele 1 section fiber 74.9999923706055 224.999984741211 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_133.out -ele 1 section fiber 53.5714308420818 182.142845789593 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_134.out -ele 1 section fiber 74.9999980926513 182.142852147419 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_135.out -ele 1 section fiber 74.9999930063882 160.714274724324 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_136.out -ele 1 section fiber 96.4285659790039 160.714279174805 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_137.out -ele 1 section fiber 96.4285634358724 182.14284515381 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_138.out -ele 1 section fiber 96.4285678863524 139.28570620219 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_139.out -ele 1 section fiber 117.8571434021 139.285706837972 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_140.out -ele 1 section fiber 117.857147216797 160.714279174805 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_141.out -ele 1 section fiber 139.285713195801 117.857131958008 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_142.out -ele 1 section fiber 139.285717010498 139.285704294839 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_143.out -ele 1 section fiber 139.285717010498 96.4285672505701 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_144.out -ele 1 section fiber 160.714279174805 96.4285659790039 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_145.out -ele 1 section fiber 160.714279174805 117.857131958008 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_146.out -ele 1 section fiber 160.71428235372 74.9999930063878 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_147.out -ele 1 section fiber 182.142855962116 74.9999993642157 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_148.out -ele 1 section fiber 182.14284515381 96.4285634358724 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_149.out -ele 1 section fiber 182.142860412598 53.5714302062988 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_150.out -ele 1 section fiber 203.571426391602 53.5714340209961 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_151.out -ele 1 section fiber 203.571427027384 75.0000019073488 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_152.out -ele 1 section fiber 203.571430206299 32.1428591410315 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_153.out -ele 1 section fiber 224.999988714853 32.1428612073277 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_154.out -ele 1 section fiber 224.999984741211 53.5714340209961 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_155.out -ele 1 section fiber 225.000011285153 10.7142825126633 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_156.out -ele 1 section fiber 246.428566137944 10.7142888704974 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_157.out -ele 1 section fiber 246.428542931875 32.1428599357605 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_158.out -ele 1 section fiber 267.857132275899 10.714287757874 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_159.out -ele 1 section fiber 203.571445465087 10.7142880757654 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_160.out -ele 1 section fiber 182.142872174582 10.7142845789601 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_161.out -ele 1 section fiber 160.714298407235 10.7142856915795 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_162.out -ele 1 section fiber 139.285728295646 10.7142818768824 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_163.out -ele 1 section fiber 117.857152938843 10.7142855326332 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_164.out -ele 1 section fiber 96.4285794893902 10.7142837842306 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_165.out -ele 1 section fiber 75.0000074704488 10.7142844200134 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_166.out -ele 1 section fiber 53.5714340209961 10.7142848968506 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_167.out -ele 1 section fiber 32.1428616841634 10.7142842610677 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_168.out -ele 1 section fiber 53.5714340209961 32.1428546905518 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_169.out -ele 1 section fiber 32.1428604125976 32.1428527832031 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_170.out -ele 1 section fiber 10.7142868041992 32.1428527832031 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_171.out -ele 1 section fiber 32.1428600947061 53.57142162323 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_172.out -ele 1 section fiber 10.7142871220907 53.57142162323 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_173.out -ele 1 section fiber 10.7142863273621 74.9999922116598 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_174.out -ele 1 section fiber 10.714285055796 96.4285623232528 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_175.out -ele 1 section fiber 10.7142875989282 117.857127984364 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_176.out -ele 1 section fiber 10.7142841021217 139.285693963369 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_177.out -ele 1 section fiber 10.7142861684157 160.714267730712 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_178.out -ele 1 section fiber 10.7142848968506 182.142837524414 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_179.out -ele 1 section fiber 10.7142823537195 203.57140350342 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_180.out -ele 1 section fiber 32.1428546905518 160.714263916016 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_181.out -ele 1 section fiber 32.1428546905518 182.142837524414 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_182.out -ele 1 section fiber 32.1428561210633 139.285690148672 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_183.out -ele 1 section fiber 53.5714267094933 139.285693804424 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_184.out -ele 1 section fiber 53.5714232126877 160.714268366496 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_185.out -ele 1 section fiber 53.571428934733 117.857127507527 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_186.out -ele 1 section fiber 75.0000038146973 117.857131958008 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_187.out -ele 1 section fiber 74.999997456868 139.28570175171 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_188.out -ele 1 section fiber 75.0000038146973 96.4285659790039 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_189.out -ele 1 section fiber 96.4285736083985 96.4285647074377 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_190.out -ele 1 section fiber 96.4285717010497 117.857132593791 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_191.out -ele 1 section fiber 117.857145309449 96.4285653432212 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_192.out -ele 1 section fiber 117.857139587402 117.857131958008 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_193.out -ele 1 section fiber 96.4285736083984 74.9999923706055 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_194.out -ele 1 section fiber 117.857147216797 74.9999936421712 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_195.out -ele 1 section fiber 117.857145309449 53.5714206695567 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_196.out -ele 1 section fiber 139.285717010498 53.57142384847 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_197.out -ele 1 section fiber 139.285717010498 74.9999910990393 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_198.out -ele 1 section fiber 139.285720984141 32.1428542137146 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_199.out -ele 1 section fiber 160.714286645254 32.1428542137146 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_200.out -ele 1 section fiber 160.714287439982 53.571424484253 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_201.out -ele 1 section fiber 117.857149124145 32.1428553263342 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_202.out -ele 1 section fiber 96.4285753568016 32.1428535779314 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_203.out -ele 1 section fiber 96.4285736083984 53.57142384847 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_204.out -ele 1 section fiber 75.0000077883403 32.1428542137146 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_205.out -ele 1 section fiber 75.000005722046 53.5714219411215 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_206.out -ele 1 section fiber 53.5714340209961 53.5714225769043 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_207.out -ele 1 section fiber 75.0000019073485 74.9999930063885 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_208.out -ele 1 section fiber 53.5714311599732 74.999992052714 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_209.out -ele 1 section fiber 32.1428589820862 74.9999922116598 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_210.out -ele 1 section fiber 53.5714314778649 96.4285628000895 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_211.out -ele 1 section fiber 32.1428580284119 96.4285581906638 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_212.out -ele 1 section fiber 32.1428580284119 117.857124487559 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_213.out -ele 1 section fiber 182.142860730489 32.1428575515748 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_214.out -ele 1 section fiber 160.714279174805 203.571426391602 stressStrain
recorder Element -file FiberResults/MKsectionStressFiber_215.out -ele 1 section fiber 267.857116699219 96.4285774230957 stressStrain
pattern Plain 2 "Linear" {
	load 2 0 0 0 0 1 0}
integrator DisplacementControl 2 5 6.66666666666667E-10
analyze 3000
wipe
