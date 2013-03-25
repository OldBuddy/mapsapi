describe("DG JSONP Module", function() {

    /**
     * Проверка, что срабатывает success callback при корректном ответе сервера
     *
     * - Проводим запрос на тестовый сервер http://127.0.0.1:3000/test
     * - Проверяем, что сработал success callback
     * - Проверяем, что success callback вернул ожидаемые данные
     *
     * @author Andrey Chizh <a.chizh@2gis.kiev.ua>
     * @version 1.0.1
     * @module Jsonp
     */
    it("should get a success responce", function () {
        var callback = jasmine.createSpy();

        L.DG.Jsonp({
            url: 'http://127.0.0.1:3005/test',
            success: callback
        });

        waitsFor(function() {
            return callback.callCount === 1;
        });

        runs(function() {
            expect(callback).toHaveBeenCalledWith({ pathname : 'test' });
        });

    });

    /**
     * Проверка, что срабатывает error callback при отсутствии параметров url
     *
     * - Вызываем AJAX без задания параметров url
     * - Проверяем, что сработал error callback
     *
     * @author Andrey Chizh <a.chizh@2gis.kiev.ua>
     * @version 1.0.1
     * @module Jsonp
     */
    it("should get a error responce on empty url", function () {
        var callback = jasmine.createSpy();

        L.DG.Jsonp({
            timeout: 1000,
            error: callback
        });

        waitsFor(function() {
            return callback.callCount === 1;
        });

        runs(function() {
            expect(callback).toHaveBeenCalled();
        });

    });

    /**
     * Проверка, что срабатывает error callback при некорректном запросе
     *
     * - Проводим некорректный запрос на тестовый сервер http://127.0.0.1:3005/cat (не существующий контроллер cat)
     * - Проверяем, что сработал error callback
     *
     * @author Andrey Chizh <a.chizh@2gis.kiev.ua>
     * @version 1.0.1
     * @module Jsonp
     */
    it("should get a error responce on bad server request", function () {
        var callback = jasmine.createSpy();

        L.DG.Jsonp({
            url: 'http://127.0.0.1:3005/',
            error: callback
        });

        waitsFor(function() {
            return callback.callCount === 1;
        });

        runs(function() {
            expect(callback).toHaveBeenCalled();
        });

    });

    /**
     * Проверка, что перед запросом происходит вызов beforeSend callback
     *
     * - Проводим запрос на тестовый сервер http://127.0.0.1:3005/test
     * - Проверяем, что сработал beforeSend callback
     *
     * @author Andrey Chizh <a.chizh@2gis.kiev.ua>
     * @version 1.0.1
     * @module Jsonp
     */
    it("should calls a beforeSend callback", function () {
        var callback = jasmine.createSpy();

        L.DG.Jsonp({
            url: 'http://127.0.0.1:3005/test',
            beforeSend: callback
        });

        waitsFor(function() {
            return callback.callCount === 1;
        });

        runs(function() {
            expect(callback).toHaveBeenCalled();
        });

    });

    /**
     * Проверка, что после запроса происходит вызов complete callback
     *
     * - Проводим запрос на тестовый сервер http://127.0.0.1:3005/test
     * - Проверяем, что сработал complete callback
     *
     * @author Andrey Chizh <a.chizh@2gis.kiev.ua>
     * @version 1.0.1
     * @module Jsonp
     */
    it("should calls a complete callback", function () {
        var callback = jasmine.createSpy();

        L.DG.Jsonp({
            url: 'http://127.0.0.1:3005/test',
            complete: callback
        });

        waitsFor(function() {
            return callback.callCount === 1;
        });

        runs(function() {
            expect(callback).toHaveBeenCalled();
        });

    });

    /**
     * Проверка, что AJAX возвращает объект с методом отмены вызова
     *
     * - Проводим запрос на тестовый сервер http://127.0.0.1:3005/ на контроллер test
     * - Проверяем, что вернулся объект
     * - Проверяем, что существует метод cancel
     *
     * @author Andrey Chizh <a.chizh@2gis.kiev.ua>
     * @version 1.0.1
     * @module Jsonp
     */
    it("should be return cancel callback method", function() {

        var jsonp = L.DG.Jsonp({
            url: 'http://127.0.0.1:3005/test'
        });

        expect(jsonp).toBeDefined();
        expect(jsonp.cancel).toBeDefined();
    });

    /**
     * Проверка, что работает метод отмены вызова
     *
     * - Проводим запрос на тестовый сервер http://127.0.0.1:3005/test
     * - Проверяем, что вернулся объект
     * - Проверяем, что существует метод cancel
     *
     * @author Andrey Chizh <a.chizh@2gis.kiev.ua>
     * @version 1.0.1
     * @module Jsonp
     */
    it("should that the cancel callback method works", function () {
        var callback = jasmine.createSpy();

        var jsonp = L.DG.Jsonp({
            url: 'http://127.0.0.1:3005/test',
            success: callback
        });

        jsonp.cancel();

        waitsFor(function() {
            return callback.callCount === 0;
        });

        runs(function() {
            expect(callback).not.toHaveBeenCalled();
        });

    });

    /**
     * Проверка, что не перепутываются 2 AJAX запроса
     *
     * - Проводим запросы на тестовый сервер http://127.0.0.1:3005/ на контроллеры testA и TestB
     * - Проверяем, что вернулся объект
     * - Проверяем, что сработали success callback для обоих запросов
     * - Проверяем, что success callback вернули ожидаемые данные
     *
     * @author Andrey Chizh <a.chizh@2gis.kiev.ua>
     * @version 1.0.1
     * @module Jsonp
     */
    it("should that 2 callbaks are not mixed", function () {
        var callbackA = jasmine.createSpy();
        var callbackB = jasmine.createSpy();

        L.DG.Jsonp({
            url: 'http://127.0.0.1:3005/testA',
            success: callbackA
        });

        L.DG.Jsonp({
            url: 'http://127.0.0.1:3005/testB',
            success: callbackB
        });

        waitsFor(function() {
            return (callbackA.callCount === 1 && callbackB.callCount === 1);
        });

        runs(function() {
            expect(callbackA).toHaveBeenCalledWith({ pathname : 'testA' });
            expect(callbackB).toHaveBeenCalledWith({ pathname : 'testB' });
        });
    });

});
