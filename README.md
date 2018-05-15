# Crobot

Crobot is a Slack bot user. It is designed to maintain a list of users that have to bring breakfast to the office.

In France :fr:, the breakfast is composed of [**cro**issant](https://en.wikipedia.org/wiki/Croissant), hence the **Cro**bot name.

## Crobot's purpose

Every people working in an open space knows one thing: **DO NOT LEAVE YOUR COMPUTER UNLOCKED**. If someone leaves its computer unlocked, one of his coworker will most likely go to his computer and do stupid things assuming his identity.

One of these stupid things is to tell other people that he will bring the breakfast for everybody in the near future.

We can say that...

> He just got croissanted :sunglasses:

The _croissanted_ person will most likely deny the fact that he was _croissanted_ for several reasons:

* > I was just looking for a document in the next office, I didn't need to lock my computer

* > I was speaking to John and didn't pay attention to my computer, but it's not valid because I was really close to my computer

Enough with these bad excuses. If you've been _croissanted_, it's your fault, you have to be more careful. Just remember that it could have been worse.

Crobot is there to make sure that there is no possible denial of _croissantage_. Once you're in the Crobot's list, the only way to be removed is to bring croissants to everyone.

## How does it work

### Get on the Crobot's list

To get on the Crobot's list, the only thing to do is to ping it with the keyword `croissant`.

> @crobot I will bring croissants next time

Simple as that. So if you want someone to bring the croissants, just type in this command on one of your coworker's Slack.

This command will output how many times the _croissanted_ user have to bring breakfast.

> Looks like `<user>` needs to bring breakfast `<count>` times!

### Get off the Crobot's list

To get off the Crobot's list, 2 people have to ping crobot with the keyword `paid` and tell he/she has paid his/her debt.

> @crobot @Jean has paid his debt

Don't try to cheat, it will be sanctionned ! ;)

### Get the Crobot's list

You can ask Crobot the list of users' breakfast debts by pinging it with the keyword `list`

> @crobot list

This will output something like:

> * `<user1>`: `<count>` times
> * `<user2>`: `<count>` times
> * `<user3>`: `<count>` times

### Blacklisted users

You can ask Crobot to blacklist you. When you are blacklisted, you can't be croissanted anymore, but you still have to pay your debt.

To blacklist you:
> @crobot blacklist me

To get a list of blacklisted users:
> @crobot blacklist list

> * `<user1>`
> * `<user2>`
> * `<user3>`

To get off the blacklist:
> @crobot unblacklist me

## Next things to do

* Add an help command to explain how Crobot works
* Switch from RTM API to Web API
* Find a way to store your data so they are not lost when you restart crobot
