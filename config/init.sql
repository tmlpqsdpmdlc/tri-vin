create database trivin;

use trivin;

create table vins (
    id_vins int primary key auto_increment not null,
    nom varchar(255) not null,
    millesime varchar(4) not null,
    couleur varchar(5) not null,
    date_consommation datetime,
    etiquette text, 
    commentaire_personnel text,
    classement_general int
);

create table cepages (
    id_cepages int primary key auto_increment,
    nom varchar(255) not null
);

insert into cepages (nom) values 
('Chardonnay'),
('Sauvignon'),
('Viognier'),
('Riesling'),
('Chenin'),
('Sémillon'),
('Muscat à petits grains'),
('Gewûrztraminer'),
('Pinot noir'),
('Cabernet franc'),
('Cabernet sauvignon'),
('Syrah'),
('Grenache'),
('Merlot'),
('Carignan'),
('Cinsaut'),
('Gamay'),
('Côt');

create table vins_has_cepages (
    id_vins_has_cepages int primary key auto_increment,
    id_vins int not null,
    id_cepages int not null,
    constraint vc1 FOREIGN KEY (id_vins) REFERENCES vins(id_vins) on delete cascade,
    constraint vc2 FOREIGN KEY (id_cepages) REFERENCES cepages(id_cepages) on delete cascade
);

create table vignerons (
    id_vignerons int primary key auto_increment,
    nom varchar(255)
);

create table vins_has_vignerons (
    id_vins_has_vignerons int primary key auto_increment,
    id_vins int not null,
    id_vignerons int not null,
    constraint vv1 foreign key (id_vins) references vins(id_vins) on delete cascade,
    constraint vv2 foreign key (id_vignerons) references vignerons(id_vignerons) on delete cascade
);

create table membres (
    id_membres int primary key auto_increment,
    email varchar(255) not null,
    password varchar(255) not null
);

create table classements_personnels_vins (
    id_classements_personnels_vins int primary key auto_increment,
    id_vins int not null,
    id_membres int not null,
    classements_personnels_vins int not null,
    constraint vp1 foreign key (id_vins) references vins(id_vins) on delete cascade,
    constraint vp2 foreign key (id_membres) references membres(id_membres) on delete cascade
);
