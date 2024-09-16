import {Text, View, SafeAreaView, ScrollView, Image, TextInput, Pressable } from 'react-native';
import {useState} from 'react';
export default function Welcome(){
    const [department, setDepartment]=useState('Health and Science');
    const [disp, setDisp] = useState('block');
    const toggleDisplay = () => {
        setDisp(prevDisp => (prevDisp === 'none' ? 'block' : 'none'));
    }
    return(
        <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
            <ScrollView style={{margin: "2%"}}>
                <View style={{flexDirection: 'row', marginBottom: '5%'}}>
                    <Image source={require('../assets/images/plainL.jpg')} style={{width:70, height:50}}/>
                    <View style={{flexDirection: 'row',marginLeft: '45%'}}>
                        <View style={{borderWidth: 1, borderRadius: '50%',backgroundColor: 'rgba(0, 0, 0, 0.05)'}}>
                            <Image source={{uri: 'https://img.icons8.com/carbon-copy/100/bell--v1.png'}} style={{width:35, height:33, marginTop: '15%'}}/>
                        </View>
                        <View style={{borderWidth: 1, borderRadius: '50%',backgroundColor: 'rgba(0, 0, 0, 0.05)',marginLeft: '5%'}}>
                            <Image source={{uri: 'https://img.icons8.com/ios/50/sun--v1.png'}} style={{width:35, height:25, marginTop: '25%'}}/>
                        </View>
                        <View style={{borderWidth: 1, borderRadius: '50%',backgroundColor: 'rgba(0, 0, 0, 0.05)',marginLeft: '5%'}}>
                            <Image source={{uri: 'https://img.icons8.com/ios/50/user--v1.png'}} style={{width:30, height:25, marginTop: '20%'}}/>
                        </View>
                    </View>
                    
                </View>
                <Text style={{fontSize: '19%'}}>Welcome ..User..!</Text>
                <View style={{margin: '2%', borderRadius: '20%', padding: '3%', flexDirection: 'row'}}>
                    <Pressable onPress={toggleDisplay}>
                        <View style={{marginRight: '5%'}}>
                            <Image source={{uri: 'https://img.icons8.com/ios/50/menu--v1.png'}} style={{width:20, height:30}} /> 
                        </View>
                    </Pressable>
                    <View>
                        <TextInput placeholder={department} placeholderTextColor={'black'} style={{width: 250, height: 30, marginRight: 15}}/>                    
                    </View>
                    <View>
                        <Image source={{uri: 'https://img.icons8.com/ios/50/search--v1.png'}} style={{width:30, height:30}}/>
                    </View>
                </View>
                <View style={{position: 'relative', display: disp, backgroundColor: 'rgba(0,0,0,0.1)', padding: '5%', borderRadius: '5%'}}>
                    <Pressable style={{marginBottom: '5%'}} onPress={()=>{setDepartment('Agriculture, Land Reform and Rural Development'), setDisp('none')}}><Text>Agriculture, Land Reform and Rural Development</Text></Pressable>
                    <Pressable style={{marginBottom: '5%'}} onPress={()=>{setDepartment('Basic Education'), setDisp('none')}}><Text>Basic Education</Text></Pressable>
                    <Pressable style={{marginBottom: '5%'}} onPress={()=>{setDepartment('Communications and Digital Technologies'), setDisp('none')}}><Text>Communications and Digital Technologies</Text></Pressable>
                    <Pressable style={{marginBottom: '5%'}} onPress={()=>{setDepartment('Defense and Military Veterans'), setDisp('none')}}><Text>Defense and Military Veterans</Text></Pressable>
                    <Pressable style={{marginBottom: '5%'}} onPress={()=>{setDepartment('Health and Science'), setDisp('none')}}><Text>Health and Science</Text></Pressable>
                    <Pressable style={{marginBottom: '5%'}} onPress={()=>{setDepartment('Home Affairs'), setDisp('none')}}><Text>Home Affairs</Text></Pressable>
                    <Pressable style={{marginBottom: '5%'}} onPress={()=>{setDepartment('International Relations and Cooperation'), setDisp('none')}}><Text>International Relations and Cooperation</Text></Pressable>
                    <Pressable style={{marginBottom: '5%'}} onPress={()=>{setDepartment('Justice and Constitutional Development'), setDisp('none')}}><Text>Justice and Constitutional Development</Text></Pressable>
                    <Pressable onPress={()=>{setDepartment('Public Works and Infrastructure'), setDisp('none')}}><Text>Public Works and Infrastructure</Text></Pressable>
                </View>
                <View style={{margin: "2%"}}>
                    <Text style={{marginBottom: '5%'}}>Depertment of {department}</Text>
                    <View style={{shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 5, height: '30%',marginBottom: '3%',  backgroundColor: 'white', padding: '5%', borderRadius: '20%'}}><Text>Projects</Text></View>
                    <View style={{shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 5, height: '30%', marginBottom: '3%',backgroundColor: 'white', padding: '5%', borderRadius: '20%'}}><Text>Budget Allocation</Text></View>
                    <View style={{shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 5, height: '30%',marginBottom: '3%', backgroundColor: 'white', padding: '5%', borderRadius: '20%'}}><Text>Success Rates</Text></View>
                </View>
                <View style={{flexDirection: 'row', marginTop: '10%', justifyContent: 'center', marginBottom: '5%'}}>
                    <Pressable style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '2%', borderRadius:'10%', marginRight:'10%'}}>
                        <Text style={{color: '#B7C42E', fontSize: '20%'}}>Explore Ministers</Text>
                    </Pressable>
                    <Pressable style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '2%', borderRadius:'10%'}}>
                        <Text style={{color: '#B7C42E', fontSize: '20%'}}>Report Issues</Text>
                    </Pressable>
                </View>
                <View>
                    <Text>Your favourites</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}