let palindrome = function(word)
{
    let len = word.length;
    let start = word.substring(0,Math.floor(len/2)).toLowerCase();
    let end = word.substring(len - Math.floor(len/2)).toLowerCase();
    let flip = end.split('').reverse().join('');

    return(start == flip);
}

function DoTest()
{
    let wordToTest = document.getElementById('userInput').value;
    if(wordToTest == '')
    {
        alert('You have to type a word in for this to work :)')
    }
    else
    {
        if(palindrome(wordToTest))
        {
            alert('The word ' + wordToTest + ' is a palindrome!');
        }
        else
        {
            alert('The word ' + wordToTest + ' is NOT a palindrome!');
        }
    }

}

function DoSubmitForm()
{
    let name = document.getElementById('fname').value + ' ' + document.getElementById('lname').value;
    let zip = document.getElementById('zip').value;
    if(name.length > 20 || name.length == 0 || zip.length != 5)
    {
        alert('Your entry is invalid. Please try again');
    }
    else
    {
        alert('Your menory serves you well, ' + name + ' .');
    }
}