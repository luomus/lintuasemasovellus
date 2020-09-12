import React from "react";
import {useState} from "react";
import {useEffect} from "react";

const esim = [
    {
        suomeksi:"jokunimi", ruotsiksi:"ruotsinimi", tieteellinen:"tieteellinennimi", sijainti:"paikka", havainnoija:"henkilö", aika:"aika" 
    }
] 

export const HavaintoList = () => {
    const [list, setList] = useState([]) 

console.log(list)

    useEffect(()=>{
        console.log(list)



setList(esim) 
    },[])
    console.log(list)
    if (!list) return null
    return(
        <div>
            {list.map((entry)=>{
                return(
                    <div>
                        <div>
                            {entry.suomeksi}
                            </div>
                        </div>
                )
            })}
            </div>
    )  
}