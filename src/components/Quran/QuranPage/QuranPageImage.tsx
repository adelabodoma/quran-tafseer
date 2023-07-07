import {Aya, QuranDataPageDetails} from "../../../quranData";
import {Highlighter} from "./Highlighter/Highlighter";
import {useSelector} from "react-redux";
import {getTafseerState} from "../../../redux/selectors";
import {useEffect, useState} from "react";
import {getPageHighlighters} from "../../../services/client.service";

interface Props {
    pageNumber: string
}

export const QuranPageImage = (props: Props) => {
    const {filter} = useSelector(getTafseerState)
    const [pageHighlighters, setPageHighlighters] = useState<Aya[]>()
    useEffect(() => {
        (async () => {
            const response = await getPageHighlighters(Number(filter?.currentPage))
            setPageHighlighters(response)
        })()
    }, [filter])

    return <>
        <img className='quran-page__img' src={require(`../../../assets/images/pages/${props?.pageNumber}.png`)}
             alt={props.pageNumber}/>
        {
            pageHighlighters?.map(({highlighterId, ayaNumber, styles}, index) => {
                const [width, top, left] = styles
                return <Highlighter
                    key={ayaNumber + index}
                    top={top}
                    left={left}
                    width={width}
                    ayaNumber={ayaNumber}
                    highlighterId={highlighterId}/>
            })
        }
    </>
}
