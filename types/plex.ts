type SectionAttributes = {
    key: string,
    type: string,
    title: string,
    updatedAt: string, // looks like epoch ?
    createdAt: string,
    scannedAt: string,
    content: string,
    directory: string
};

export type Section = {
    type: string,
    name: string,
    attributes: SectionAttributes,
    elements: [
        type: string,
        name: string,
        attributes: {
            type: string, 
            name: string,
            attributes: {
                id: string,
                path: string
            }
        }[]
    ]

};

type LibraryAttributes = {
    size: string,
    allowSync: string,
    art: string,
    content: string,
    identifier: string,
    librarySectionID: string,
    librarySectionTitle: string,
    librarySectionUUID: string,
    mediaTagPrefix: string,
    mediaTagVersion: string,
    thumb: string,
    title1: string,
    title2: string,
    viewGroup: string
};

type MediaAttributes = {
    ratingKey: string,
    key: string,
    guid: string,
    studio: string,
    type: string,
    title: string,
    contentRating: string,
    summary: string,
    audienceRating: string,
    viewOffset: string,
    viewCount: string,
    lastViewedAt: string,
    year: string,
    tagline: string,
    thumb: string,
    art: string,
    duration: string,
    originallyAvailableAt: string,
    addedAt: string,
    updatedAt: string,
    audienceRatingImage: string,
    chapterSource: string,
    primaryExtraKey: string
};
    
export type MediaMetadata = {
    type: string,
    name: string,
    attributes: {
        tag: string
    }
};

export type Media = {
    type: string,
    name: string,
    attributes: MediaAttributes,
    elements: MediaMetadata[]
}

export type Library = {
    elements: {
        type: string,
        name: string,
        attributes: LibraryAttributes,
        elements: Media[]
    }[]
};

export type Pick = {
    id: string,
    liked: boolean
};

export type Movie = {
    id: string,
    title: string,
    studio: string,
    year: string,
    genre: string [],
    tagline: string,
    summary: string,
    thumb: string,
    art: string,
    contentRating: string,
    duration: string
};

