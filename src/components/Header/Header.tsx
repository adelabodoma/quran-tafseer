import './Header.scss'
import Select from "react-select";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import 'react-h5-audio-player/src/styles.scss'
import {SelectModal} from "../ui-components/SelectModal/SelectModal";
import {useDispatch, useSelector} from "react-redux";
import {setActiveModal, setFilter} from "../../redux/quran.slice";
import {getTafseerState} from "../../redux/selectors";
import {useCallback, useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {getSuraDetails} from "../../services/client.service";
import {ModalTypes, Sura} from "../../types";

const options = [
    {value: 'option 1', label: 'الخيار رقم 5'},
    {value: 'option 2', label: 'الخيار رقم 5'},
    {value: 'option 3', label: 'الخيار رقم 5'}
]

const tafseerOptions = [
    {value: 'option 1', label: 'السعدي'},
    {value: 'option 2', label: 'البغوي'},
    {value: 'option 3', label: 'ابن كثير'},
    {value: 'option 4', label: 'القرطبي'},
    {value: 'option 5', label: 'الطبري'},
]

const sheikhOptions = [
    {value: 'Husary_64kbps', label: 'الحصري'},
    {value: 'Nasser_Alqatami_128kbps', label: 'ناصر القطامي'},
    {value: 'Abdul_Basit_Murattal_64kbps', label: 'عبدالباسط عبدالصمد'},
    {value: 'Minshawy_Murattal_128kbps', label: 'المنشاوي'},
    {value: 'Alafasy_64kbps', label: 'مشاري العفاسي'},
]

const style = {
    control: (base: any) => ({
        ...base,
        // This line disable the blue border
        boxShadow: 'none',
        '&:hover, &:active': {
            borderColor: '#00A79D',
            outlineColor: '#00A79D',
        }
    })
};

export const Header = () => {
    const dispatch = useDispatch()
    const {filter} = useSelector(getTafseerState)
    const [selectedSura, setSelectedSura] = useState<Sura>()

    const getCurrentLink = useCallback(() => {
        const sura = Number(filter?.currentSura).toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping: false})
        const aya = Number(filter?.currentAya).toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping: false})
        const sheikh = filter?.currentSheikh

        return `https://quran.ksu.edu.sa/ayat/mp3/${sheikh}/${sura}${aya}.mp3`
    }, [filter])

    const onModalSelectClick = (type: ModalTypes) => {
        dispatch(setActiveModal({[type]: true}))
    }

    const goToNextAya = () => {
        dispatch(setFilter({
            key: 'currentAya',
            value: (Number(filter?.currentAya) + 1).toString()
        }))
    }

    useEffect(() => {
        (async () => {
            if (filter?.currentSura) {
                const response = await getSuraDetails(Number(filter.currentSura))
                setSelectedSura(response)
            }
        })()
    }, [filter])

    return <div className='header'>
        <Container>
            <Row>
                <Col md={2} className='co-left-border'>
                    <img src={require('../../assets/images/logo.png')} alt='Logo' height={190}/>
                </Col>
                <Col md={5} className='co-left-border'>
                    <div className='header__pair'>
                        <div className='header__pair__item'>
                            <div className='header__pair__item__control'>
                                <label className='header__pair__item__control__label'>البحث</label>
                                <input className='co-input' placeholder='إختر'/>
                            </div>
                            <div className='header__pair__item__control'>
                                <label className='header__pair__item__control__label'>التفسير</label>
                                <Select styles={style} options={tafseerOptions} placeholder='إختر'/>
                            </div>
                        </div>
                        <div className='header__pair__item'>
                            <div className='header__pair__item__control'>
                                <label className='header__pair__item__control__label'>السورة</label>
                                <SelectModal value={selectedSura?.arabicName} placeholder='إختر'
                                             onClick={() => onModalSelectClick('isSuraModalOpen')}/>
                            </div>
                            <div className='header__pair__item__control'>
                                <label className='header__pair__item__control__label'>الأية</label>
                                <SelectModal placeholder='إختر' value={filter?.currentAya}
                                             onClick={() => onModalSelectClick('isAyaModalOpen')}/>
                            </div>
                            <div className='header__pair__item__control'>
                                <label className='header__pair__item__control__label'>الصفحة</label>
                                <SelectModal value={filter?.currentPage} placeholder='إختر'
                                             onClick={() => onModalSelectClick('isPageModalOpen')}/>
                            </div>
                            <div className='header__pair__item__control'>
                                <label className='header__pair__item__control__label'>الجزء</label>
                                <SelectModal value={filter?.currentGoz2} placeholder='إختر'
                                             onClick={() => onModalSelectClick('isGoz2ModalOpen')}/>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col md={5}>
                    <div className='header__pair'>
                        <div className='header__pair__item'>
                            <div className='header__pair__item__control'>
                                <label className='header__pair__item__control__label'>القارئ</label>
                                <Select
                                    defaultValue={sheikhOptions[0]}
                                    styles={style} options={sheikhOptions}
                                    onChange={(item) => {
                                        console.log(item?.value)
                                        dispatch(setFilter({
                                            key: 'currentSheikh',
                                            value: item?.value || ''
                                        }))
                                    }}
                                    placeholder='إختر'/>
                            </div>
                            <div className='header__pair__item__control'>
                                <label className='header__pair__item__control__label'>إعدادات التكرار</label>
                                <Select styles={style} options={options} placeholder='إختر'/>
                            </div>
                        </div>
                        <div className='header__pair__item header__pair__item__control'>
                            <AudioPlayer
                                style={{direction: 'ltr'}}
                                autoPlay={false}
                                src={getCurrentLink()}
                                onPlay={e => console.log("onPlay")}
                                autoPlayAfterSrcChange={true}
                                onEnded={goToNextAya}
                                // other props here
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
}

