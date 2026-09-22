import numpy as np
from PIL import Image
rng=np.random.default_rng(7)
N=512
def fnoise(shape,lo,hi,aniso=(1,1),seed=None):
    r=np.random.default_rng(seed)
    w=r.standard_normal(shape)
    F=np.fft.fft2(w)
    fy=np.fft.fftfreq(shape[0])[:,None]*shape[0]*aniso[0]
    fx=np.fft.fftfreq(shape[1])[None,:]*shape[1]*aniso[1]
    f=np.sqrt(fx**2+fy**2)
    m=((f>=lo)&(f<=hi)).astype(float)*np.where(f>0,1/np.maximum(f,1e-3)**0.5,0)
    o=np.real(np.fft.ifft2(F*m))
    o=(o-o.mean())/(o.std()+1e-9)
    return o
def norm01(a):return (a-a.min())/(a.max()-a.min()+1e-9)
def normal_from(h,strength):
    dx=(np.roll(h,-1,1)-np.roll(h,1,1))*strength
    dy=(np.roll(h,-1,0)-np.roll(h,1,0))*strength
    n=np.stack([-dx,dy,np.ones_like(h)],-1)
    n/=np.linalg.norm(n,axis=-1,keepdims=True)
    return ((n*.5+.5)*255).astype(np.uint8)
def save(name,col,h,st):
    Image.fromarray(np.clip(col*255,0,255).astype(np.uint8)).save(name+'_c.webp',quality=88)
    Image.fromarray(normal_from(h,st)).save(name+'_n.webp',quality=90)
y,x=np.mgrid[0:N,0:N]/N
# WOOD: grain runs along v (image y)
warp=fnoise((N,N),1,4,seed=1)*.035
g1=fnoise((N,N),4,120,aniso=(14,1),seed=2)      # long streaks
g2=fnoise((N,N),40,400,aniso=(22,1),seed=3)    # fine fibers
rings=np.abs(np.sin((x+warp+fnoise((N,N),1,3,seed=4)*.02)*np.pi*7))**3
h=norm01(g1*.55+g2*.35+rings*.25)
# knots
for k in range(3):
    cx,cy=rng.random(),rng.random()
    dxk=np.minimum(abs(x-cx),1-abs(x-cx));dyk=np.minimum(abs(y-cy),1-abs(y-cy))*.35
    d=np.sqrt(dxk**2+dyk**2)
    h-=np.exp(-(d/.018)**2)*.5+np.sin(d*160)*np.exp(-(d/.05)**2)*.1
v=.5+.5*norm01(h)**1.3
tint=np.array([1.0,.97,.93])
col=v[...,None]*tint
# painted streak darkening
col*=(1-.12*np.clip(norm01(g1)-.6,0,1)[...,None]*2.5)
save('wood',col,h,2.2)
# STONE: soft painted blotches + pits
b=fnoise((N,N),2,10,seed=5);c=fnoise((N,N),10,60,seed=6);p=fnoise((N,N),60,200,seed=7)
h=norm01(b*.5+c*.35+p*.15)
v=.78+.22*norm01(b*.6+c*.4)
col=v[...,None]*np.array([1,.99,.97])
col*=1-.15*(norm01(p)>.8)[...,None]
save('stone',col,h,3.0)
# METAL: mottled + scratches
b=fnoise((N,N),2,12,seed=8);s=fnoise((N,N),30,250,aniso=(1,.03),seed=9)
h=norm01(b*.3+s*.2)
v=.82+.18*norm01(b)
col=v[...,None]*np.array([1,1,1])
col+= .06*np.clip(norm01(s)-.75,0,1)[...,None]*4
save('metal',col,h,1.2)
# CLOTH/rope weave
wv=np.sin(x*2*np.pi*64)*np.sin(y*2*np.pi*64)
f=fnoise((N,N),20,120,seed=10)
h=norm01(wv*.6+f*.4)
col=(.8+.2*norm01(h))[...,None]*np.array([1,.98,.94])
save('cloth',col,h,2.0)
print('ok')
