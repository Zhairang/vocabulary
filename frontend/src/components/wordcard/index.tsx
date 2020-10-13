import React, {useEffect, useRef, useState} from 'react'
import momentjs from 'moment'
import Modal from '../modal'
import * as T from '../../types'
import './wordcard.scss'
import Content, {Description} from '../word'
import * as A from '../../audio'
import Icon from '../icon'


type Props = {
      word: T.WordEntry
    , nextWord: ()=>void
    , prevWord: ()=>void
    , onClose: ()=>void
    , review: ()=>void
    , index: {widx: number, length: number}
    , prevUnreviewed: ()=>void
    , nextUnreviewed: ()=>void
}

export default (props: Props) => {
    const {word, onClose} = props
    const card = word === null ? null : (<Card {...props}/>)
    return(
        <Modal content={card} onClose={onClose}/>
    )
}

const Card = ({word, prevWord: _prevWord, nextWord: _nextWord
    , onClose, review, index, 
    prevUnreviewed: _prevUnreviewed, 
    nextUnreviewed: _nextUnreviewed}: Props)=>{
    const {key, value:{content, description, tags, lastreview, reviewtime, reviewed}} = word
    const {widx, length} = index

    const [uncover, setUncover] = useState(false)

    const hasPrev = widx > 0
    const hasNext = widx < length - 1
    const disableCls = (test: boolean, cls: string) => cls + (test ? " disabled" :  "")
    
    useEffect(()=>{
        A.recorder.startNew(key)
    }, [key])

    const changeAction= (act: ()=>void)=> (()=> 
        {
            setUncover(false)
            act()
        })
    const prevWord = changeAction(_prevWord)
    const nextWord = changeAction(_nextWord)
    const nextUnreviewed = changeAction(_nextUnreviewed)
    const prevUnreviewed = changeAction(_prevUnreviewed)


    const since = momentjs(lastreview).fromNow()

    const topRef = useRef(null as HTMLDivElement | null)

    useEffect(()=>{
        topRef.current?.focus()
    }, [])

    const handleKeydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        switch (e.key){
            case "a":
                prevWord()
                break
            case "s":
                review()
                break
            case "d":
                nextWord()
                break
            case "w":
                setUncover(!uncover)
                break
            case "q":
                prevUnreviewed()
                break
            case "e":
                nextUnreviewed()
                break
            case "r":
                A.recorder.record(key)
                break
            case "t":
                A.recorder.save()
                break
            case "f":
                A.playAudio(key)
                break
        }
    }

    return(
        <div 
            className={reviewed? "wordcard-wrapper reviewed" : "wordcard-wrapper"}
            onKeyDown={handleKeydown}
            tabIndex={0}
            ref={topRef}
        >
            <button className="close" 
                    onClick={onClose}
            >&times;</button>
            <div className="info">
                Reviewed {since}
            </div>
            <div className="wordcard-nav">

                <div className="wordcard">                    
                    <div className={"content" + (uncover ? " uncover": "")}>
                        <Content ps={content}/>
                    </div>
                    <div className="tags">
                        {tags.map((t, i)=><span key={i}>{t}</span>)}
                    </div>
                    <div className={"description" + (uncover ? " uncover": "")} >
                        <Description desc={description}/>
                    </div>
                    <div className="buttons">
                        <button title="S" disabled={reviewed} onClick={review}>Review {reviewtime}</button>
                    </div>
                </div>
                <div className={disableCls(hasPrev, "nav-left")} onClick={prevWord} title="A">
                    <Icon icon="chevron-left"/>
                </div>
                <div className={disableCls(hasNext, "nav-right")} onClick={nextWord} title="D">
                    <Icon icon="chevron-right"/>
                </div>
                <div className ="index">
                    {widx+1} / {length}
                </div>
            </div>
        </div>
    )
}
