const common = {
    callRouter: function (data) {
        let url2go = "/"
        return new Promise((resolve, reject) => {
            $.ajax({
                dataType: "json",
                url: url2go,
                type: "POST",
                data: data,
                success: resolve,
            });
        });
    }
}

module.exports = common
