import $ from "properjs-hobo";
// import * as core from "../../core";
import viewSignup from "../../views/signup";



class Signup {
    constructor ( element ) {
        this.element = element;
        this.data = {};

        this.load().then(() => {
            this.bind();
        });
    }


    load () {
        return new Promise(( resolve ) => {
            this.element[ 0 ].innerHTML = viewSignup();
            this.fields = this.element.find( ".js-signup-field" );
            this.button = this.element.find( ".js-signup-btn" );
            resolve();
        });
    }


    bind () {
        this.button.on( "click", () => {
            this.gather();
            this.send();
        });
    }


    clear () {
        this.data = {};
        this.fields.removeClass( "is-error" ).forEach(( el ) => {
            el.value = "";
        });
    }


    reset () {
        this.element.removeClass( "is-success" );
    }


    getKey () {
        return $.ajax({
            url: "/api/form/FormSubmissionKey",
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            dataType: "json"
        });
    }


    saveForm ( key ) {
        return $.ajax({
            url: "/api/form/SaveFormSubmission",
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            dataType: "json",
            payload: {
                collectionId: "5bc3c79a652deab94f231cdb",
                form: JSON.stringify( this.data ),
                formId: "5bc3c8b0e79c7060b076caeb",
                key,
                objectName: "page-5bc3c79a652deab94f231cdb",
                pageId: "5bc3c79a652deab94f231cdb",
                pagePath: window.location.href,
                pageTitle: document.title
            }
        });
    }


    gather () {
        this.data = {};
        this.fields.forEach(( el ) => {
            this.data[ el.name ] = el.value;
        });
    }


    handle ( response ) {
        if ( response && response.errors ) {
            for ( const i in response.errors ) {
                if ( response.errors.hasOwnProperty( i ) ) {
                    this.fields.filter( `[name='${i}']` ).addClass( "is-error" );
                }
            }

        } else {
            this.element.addClass( "is-success" );
        }
    }


    send () {
        this.fields.removeClass( "is-error" );
        this.getKey().then(( json ) => {
            this.saveForm( json.key ).then(( response ) => {
                this.handle( response );

            }).catch(( response ) => {
                this.handle( response );
            });

        }).catch( () => {} );
    }


    destroy () {}
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Signup;
