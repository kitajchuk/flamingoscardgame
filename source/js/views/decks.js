export default ( json ) => {
    return `
        <div class="decks__belt js-decks-belt">
            ${json.collection.collections.map(( deck ) => {
                return `
                    <div class="decks__deck" data-deck="${deck.title}">
                        ${deck.items.map(( card ) => {
                            return `
                                <div class="decks__card js-decks-card" data-card="${card.urlId}">
                                    <img class="deck__card__graphic image js-lazy-image" data-img-src="${card.assetUrl}" data-variants="${card.systemDataVariants}" data-original-size="${card.originalSize}" data-upres="1" />
                                    <div class="deck__card__lockup">
                                        <div class="h2">${card.title}</div>
                                        ${card.excerpt ? `
                                            <div class="p">${card.excerpt}</div>
                                        ` : ``}
                                    </div>
                                </div>
                            `;

                        }).join( "" )}
                    </div>
                `;

            }).join( "" )}
        </div>
        <div class="decks__navi -wrapn">
            <div class="decks__left js-decks-left">
                ${require( `../../../blocks/svg-arrow-left.block` )}
            </div>
            <div class="decks__right js-decks-right">
                ${require( `../../../blocks/svg-arrow-right.block` )}
            </div>
        </div>
    `;
};
