# -*- coding: utf-8 -*-
def extend(extension, base):
    """
    :param base: dict of dicts
    :param extension: dict
    :return: dict
    Extend each base dict from key of extension
    """
    for part in base:
        for default_prop in extension:
            if default_prop not in base[part]:
                base[part][default_prop] = extension[default_prop]
    return base


def comment_equals(comment, wapi_comment):
    """
    :type comment: str or unicode
    :type wapi_comment: str or unicode
    :rtype: bool
    """
    return comment == '— '.decode('utf-8') + wapi_comment


def unicode_print(s):
    """
    Prints unicode strings
    :type s: unicode
    """
    s = to_unicode(s)
    print u'%s' % s,


def to_unicode(s):
    """
    Converts string to unicode if necessary
    :type s: str or unicode
    :rtype: unicode
    """
    try:
        s = str(s)
        return s.decode('utf-8')
    except UnicodeEncodeError:
        return s


def rprint(item):
    """
    Prints list or dict recursively.
    :type item: list, dict
    """
    if isinstance(item, list):
        print '[',
        for i in item:
            rprint(i)
            print ', ',
        print ']',
    elif isinstance(item, dict):
        print '{',
        for key, val in item.iteritems():
            unicode_print(key)
            print ': ',
            rprint(val)
            print ', ',
        print '}',
    else:
        unicode_print(item)


class AttrDict(dict):
    """
    Wraps a dict object or literal to access values like object properties:
    my_dict = AttrDict( {'a': 1} )
    assert my_dict.a == 1
    """
    def __init__(self, *args, **kwargs):
        super(AttrDict, self).__init__(*args, **kwargs)
        self.__dict__ = self


def to_str(s):
    """
    Converts unicode to string if necessary
    :type s: str or unicode
    :rtype: str
    """
    try:
        return s.encode('utf-8')
    except UnicodeDecodeError:
        return s


def to_int(s):
    """
    Return first number from string
    :param s: strin or unicode
    :return: int
    """
    out = ''
    started = False
    for x in s:
        if x.isdigit():
            out += x
            started = True
        if started and not x.isdigit():
            return int(out)
    return int(out)


def address_and_comment(address, comment):
    return u"%s— %s" % (address, comment)


def phone_and_comment(phone, comment):
    return u"%s—  %s" % (phone, comment)
