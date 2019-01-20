import * as core from "../core";



const dealer = {
    o: ( cards ) => {
        return core.util.shuffle( cards ).slice( 0, 3 );
    },
    pair: ( cards ) => {
        const used = cards.filter(( card ) => {
            return (card.categories[ 0 ] === "Mingo" && !card.starred);
        });
        const rando = Math.floor( Math.random() * used.length);
        const chosen = core.util.shuffle( used )[ rando ];

        return [chosen, chosen];
    },
    earn: ( cards ) => {
        const shrimp = cards.find(( card ) => {
            return (card.title === "Shrimp");
        });
        const jumbo = cards.find(( card ) => {
            return (card.title === "Jumbo Shrimp");
        });

        return [shrimp, shrimp, jumbo, shrimp, shrimp, shrimp];
    },
    helpers: ( cards ) => {
        const seagull = cards.find(( card ) => {
            return (card.title === "Seagull");
        });
        const golden = cards.find(( card ) => {
            return (card.title === "Golden Shrimp");
        });
        const spoiled = cards.find(( card ) => {
            return (card.title === "Spoiled Shrimp");
        });

        return [seagull, golden, spoiled];
    },
    mechs: ( cards ) => {
        return cards.filter(( card ) => {
            return (card.categories[ 0 ] === "Mech");
        });
    }
};

export default ( view ) => {
    const cards = dealer[ view.data.dealer ]( view.json.items );

    return `
        <div class="cards__belt">
            ${cards.map(( card ) => {
                return `
                    <div class="cards__card">
                        <img class="cards__image image js-lazy-image" data-img-src="${card.customContent.cardGraphic.assetUrl}" data-variants="${card.customContent.cardGraphic.systemDataVariants}" data-original-size="${card.customContent.cardGraphic.originalSize}" data-upres="1" />
                    </div>
                `;

            }).join( "" )}
        </div>
    `;
};
