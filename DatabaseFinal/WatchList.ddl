create table if not exists Director
(
	id int auto_increment
		primary key,
	director varchar(40) null
);

create table if not exists Genre
(
	id int auto_increment
		primary key,
	genre varchar(20) null
);

create table if not exists Movies
(
	id int auto_increment
		primary key,
	title varchar(50) null,
	year int null,
	D_id int not null,
	G_id int not null,
	length int null,
	rating varchar(10) null,
	Buttons tinyint(1) null,
	constraint Movies_ibfk_1
		foreign key (D_id) references Director (id),
	constraint Movies_ibfk_2
		foreign key (G_id) references Genre (id)
);

create index D_id
	on Movies (D_id);

create index G_id
	on Movies (G_id);

create table if not exists Users
(
	id int auto_increment
		primary key,
	username varchar(30) not null,
	FirstName varchar(30) not null,
	LastName varchar(50) not null,
	password varchar(96) not null
);

create table if not exists Favorites
(
	id int auto_increment
		primary key,
	U_id int not null,
	M_id int not null,
	constraint Favorites_ibfk_1
		foreign key (U_id) references Users (id),
	constraint Favorites_ibfk_2
		foreign key (M_id) references Movies (id)
);

create index M_id
	on Favorites (M_id);

create index U_id
	on Favorites (U_id);

create table if not exists MyReel
(
	id int auto_increment
		primary key,
	U_id int not null,
	M_id int not null,
	constraint MyReel_ibfk_1
		foreign key (U_id) references Users (id),
	constraint MyReel_ibfk_2
		foreign key (M_id) references Movies (id)
);

create index M_id
	on MyReel (M_id);

create index U_id
	on MyReel (U_id);
