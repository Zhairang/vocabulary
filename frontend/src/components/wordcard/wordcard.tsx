import React from 'react'
import momentjs from 'moment'
import Modal from '../modal/modal'
import Tags from '../tags/tags'
import * as T from '../../types'
import './wordcard.scss'
import Content, {Description} from '../word'
import Icon from '../icon'
import { isNull } from 'util'


type Props = {
      word: T.KeyValue<T.Word>
    , nextWord: ()=>void
    , prevWord: ()=>void
    , onClose: ()=>void
}

export default (props: Props) => {
    const {word, onClose} = props
    if (!isNull(word)){
        const card = isNull(word) ? null : (<Card {...props}/>)
        return(
            <Modal content={card} onClose={onClose}/>
        )
    }
    return (<></>)
}

const Card = ({word, prevWord, nextWord, onClose}: Props)=>{
    const {value:{content, description, tags, lastreview, reviewtime}} = word
    const since = momentjs(lastreview).fromNow()
    return(
        <div className="wordcard-wrapper reviewed">
            <button className="close" 
                    onClick={onClose}
            >&times;</button>
            <div className="info">
                Reviewed {since}
            </div>
            <div className="wordcard-nav">
                <div className="wordcard">                    
                    <div className="content">
                        <Content ps={content}/>
                    </div>
                    <div className="tags">
                        {tags.map((t, i)=><span key={i}>{t}</span>)}
                    </div>
                    <div className="description">
                        <Description desc={description}/>
                    </div>
                    <div className="buttons">
                        <button title="S" onClick={()=>{}}>Review</button>
                    </div>
                </div>
                <div className="nav-left" onClick={prevWord} title="A">
                    <Icon icon="chevron-left"/>
                </div>
                <div className="nav-right" onClick={nextWord} title="D">
                    <Icon icon="chevron-right"/>
                </div>
            </div>
        </div>
    )
}