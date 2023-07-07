export interface Sura {
    index: number
    arabicName: string,
    englishName: string,
    frankName: string,
    ayaCount: number,
    suraType: string,
    pageStart: number,
    pageEnd: number
}


export type ModalTypes = 'isSuraModalOpen' | 'isAyaModalOpen' | 'isPageModalOpen' | 'isGoz2ModalOpen'
export type filterTypes = 'currentPage' | 'currentSura' | 'currentAya' | 'currentGoz2' | 'currentSheikh' | 'currentQuarter' | 'tafseerLang'
