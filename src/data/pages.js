export const pages = [
    {
        path: '/',
        type: 'web',
        title: 'Mysterious World',

        content: [
            {
                type: 'text',
                value: 'This is the beginning.'
            },

            {
                type: 'text',
                value: 'Nobody remembers when this website was created.'
            },

            {
                type: 'quote',
                value: 'The archive was never meant to be found.'
            },

            {
                type: 'image',
                src: '/testimg.png',
                alt: 'An old photograph',
                caption: 'Photograph recovered from an unknown source.'
            },

            {
                type: 'link',
                text: 'Open Archive 001',
                target: '/archive/001'
            }
        ]
    },
    {
        path: '/archive/001',
        type: 'web',
        title: 'Archive 001',

        content: [
            {
                type: 'text',
                value: 'This document appears to have been archived a long time ago.'
            },

            {
                type: 'quote',
                value: 'Do not trust the date written on the document.'
            },

            {
                type: 'link',
                text: 'Open Archive 002',
                target: '/archive/002'
            }
        ]
    },

    {
        path: '/archive/002',
        type: 'web',
        title: 'Archive 002',

        content: [
            {
                type: 'text',
                value: 'The second document is currently unavailable.'
            }
        ]
    }
]