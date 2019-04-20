(function () {

    window.Components.Pages.TownNews = {
        /**
         * Returns the result of what you fetch from the API key
         * @param {array} articles
         * @returns {string} articles.title
         * @returns {string} articles.discription
         * @returns {string} articles.url
         */

        template: `
<div>

    Articles:
    <div v-for="article in articles">
        <strong v-text="article.title">
        </strong>
        <p v-text="article.description"></p>
        <a :href="article.url">know more</a>


    </div>

</div>`,

        /**
         * Returns the result of what you fetch from the API key which could be used into div
         * @param {array} articles
         */
        data() {
            return {
                articles: []
            };
        },

        /**
         * @api {get} Request News by API key
         * @apiGroup News
         *
         * @apiParam {array} News articles Information(Include title, Author, URL).
         *
         */
        methods: {

            getNews() {
                let $this = this;

                var url = 'https://newsapi.org/v2/top-headlines?' +
                    'country=us&' +
                    'apiKey=ff20a5a6821346d9891ed15352f01301';
                var req = new Request(url);
                fetch(req)
                    .then(function (response) {
                        return response.json();

                    })
                    .then(function (parsedData) {
                        console.log(parsedData);
                        $this.articles = parsedData.articles;
                    });

            }

        },

        /**
         * Implements getNews().
         */
        mounted() {
            this.getNews();
        }

    };
})();