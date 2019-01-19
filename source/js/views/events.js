export default ( view ) => {
    const events = view.json.upcoming.filter(( event ) => {
        return (event.categories[ 0 ] === view.data.filter);
    });

    return `${events.map(( event ) => {
        return `
            <div class="events__listing">
                <a class="events__listing__img" href="${event.sourceUrl}">
                    <img class="image js-lazy-image" data-img-src="${event.assetUrl}" data-variants="${event.systemDataVariants}" data-original-size="${event.originalSize}" />
                </a>
                <div class="events__listing__info h2">
                    ${event.excerpt}
                </div>
                <a class="events__listing__btn btn" href="${event.sourceUrl}" target="_blank">View on Facebook</a>
            </div>
        `;

    }).join( "" )}`;
};
